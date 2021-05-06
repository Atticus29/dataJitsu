import * as functions from 'firebase-functions';
import { assert, assertUID, catchErrors } from './helpers';
import { stripe, db, dbFirebase } from './config';
import { getCustomer, getOrCreateCustomer } from './customers';
import { attachSource } from './sources';

/**
Gets a user's subscriptions
*/
export const getSubscriptions = async(uid: string) => {
    const customer = await getCustomer(uid);
    if(!customer){
      return null;
    }
    const subs = await stripe.subscriptions.list({customer: customer.stripeCustomerId});
    console.log(subs);
    return subs;
    // return stripe.subscriptions.list({ customer });
}

/**
Creates and charges user for a new subscription
*/
export const createSubscription = async(uid:string, source:string, plan: string, coupon?: string) => {
    // console.log("got into createSubscription");
    // console.log(uid);
    // console.log(source);
    // console.log(plan);

    const customer = await getOrCreateCustomer(uid);
    // console.log("customer in createSubscription")
    // console.log(customer);
    const customerId = assert (customer, 'id'); //stripeCustomerId
    // console.log("customerId:");
    // console.log(customerId);

    await attachSource(uid, source);
    // console.log("source attached in createSubscription");

    const subscription = await stripe.subscriptions.create({
        customer: customerId,
        coupon,
        items: [
            {
              plan,
            },
        ],
    });
    // console.log("subscription in createSubscription")
    // console.log(subscription);

    // Add the plan to existing subscriptions
    dbFirebase.ref('/users/').orderByChild('uid').equalTo(uid).limitToFirst(1).once("value").then(snapshot =>{
      if(snapshot){
        console.log("dbFirebase call in cloud function yields user:");
        console.log(snapshot.val());
        const usr = snapshot.val();
        const usrId = Object.keys(usr)[0];
        let updates: any = {};
        // console.log("paidStatus about to be updated to true from cloud function!!!");
        updates['/users/' + usrId + '/paidStatus'] = true;
        dbFirebase.ref().update(updates).then(res =>{
          console.log("Did the plan add to sbuscription thing");
        }).catch(function (error) {
          console.log('Error adding plan to existing subscription: ', error);
        });
        updates = {};
        updates['/users/' + usrId + '/subscriptionInfo'] = {customerId : customerId, subscriptionId : subscription.id};
        dbFirebase.ref().update(updates).then(res => {
          console.log("Did the plan add to sbuscription thing");
        }).catch(function (error) {
          console.log('Error adding plan to existing subscription: ', error);
        });
      }
    }).catch(function (error) {
      console.log('Error adding play to subscription: ', error);
    });
    ;

    const docData = {
        [plan]: true,
        [subscription.id]: 'active',
    }
    // console.log("docData in createSubscription")
    // console.log(docData);

    await db.doc(`users/${uid}`).set(docData, { merge: true });

    return subscription;
}

/**
Cancels a subscription and stops all recurring payments
*/
export async function cancelSubscription(uid: string, subId: string): Promise<any> {
  // console.log("cancelSubscription helper function entered");
  const subscription  = await stripe.subscriptions.del(subId);
  // console.log("subscription in cancelSubscription:");
  // console.log(subscription);
  if(!subscription.plan){
    throw new functions.https.HttpsError('not-found', 'subscription plan not found');
  }


  //DB stuff

  dbFirebase.ref('/users/').orderByChild('uid').equalTo(uid).limitToFirst(1).once("value").then(snapshot =>{
    if(snapshot){
      console.log("dbFirebase call in cloud function yields user:");
      console.log(snapshot.val());
      const usr = snapshot.val();
      const usrId = Object.keys(usr)[0];
      const updates: any = {};
      updates['/users/' + usrId + '/paidStatus'] = false;
      dbFirebase.ref().update(updates).then(res => {
        console.log("Did the plan add to sbuscription thing");
      }).catch(function (error) {
        console.log('Error adding plan to existing subscription: ', error);
      });
      const ref = dbFirebase.ref('/users/' + usrId + '/subscriptionInfo');
      ref.remove().then(res => {
        console.log("Did the remove subscription info. thing");
      }).catch(function (error) {
        console.log('Error removing subscription info.: ', error);
      });
    }
  }).catch(function (error) {
    console.log('Error updating paid status: ', error);
  });

  const docData = {
      [subscription.plan.id]: false,
      [subscription.id]: 'cancelled'
  }

  await db.doc(`users/${uid}`).set(docData, { merge: true });

  return subscription;
}

/////// DEPLOYABLE FUNCTIONS ////////

export const stripeCreateSubscription = functions.https.onCall( async (data, context) => {
    console.log("stripeCreateSubscription entered");
    const uid = assertUID(context);
    console.log("uid in stripeCreateSubscription");
    console.log(uid);
    console.log(1, data)
    const source = assert(data, 'source');
    console.log("source in stripeCreateSubscription")
    console.log(source);
    const plan = assert(data, 'plan');
    console.log("plan in stripeCreateSubscription")
    console.log(plan);
    return catchErrors( createSubscription(uid, source, plan, data.coupon) );
});

export const stripeCancelSubscription = functions.https.onCall( async (data, context) => {
  console.log("stripeCancelSubscription entered");
  const uid = assertUID(context);
  console.log("uid in stripeCancelSubscription:");
  console.log(uid);
  const plan = assert(data, 'subId');
  console.log("plan in stripeCancelSubscription:");
  console.log(plan);
  return catchErrors( cancelSubscription(uid, plan) );
});

export const stripeGetSubscriptions = functions.https.onCall( async (data, context) => {
    const uid = assertUID(context);
    return catchErrors( getSubscriptions(uid) );
});
