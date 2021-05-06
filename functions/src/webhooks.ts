import { db, stripe, dbFirebase } from './config';
import * as functions from 'firebase-functions';

export const stripeWebhookSignature = functions.config().stripe.webhook_signature;

export const webhookHandler = async (data: any) => {
  const customerId = data.customer;
  const subId = data.subscription;
  const customer = await stripe.customers.retrieve(customerId);
  const uid = customer.metadata.firebaseUID;

  const subscription = await stripe.subscriptions.retrieve(subId);

  const isActive = subscription.status === 'active';


  //substitute for running dbService.updateUserSubscription(nodeId, paidStatus)
  dbFirebase.ref('/users/').orderByChild('uid').equalTo(uid).limitToFirst(1).on("value", snapshot =>{
    if(snapshot){
      console.log("dbFirebase call in webhook function yields user:");
      console.log(snapshot.val());
      const usr = snapshot.val();
      const usrId = Object.keys(usr)[0];
      const updates: any = {};
      updates['/users/' + usrId + '/paidStatus'] = isActive;
      // updates['/users/' + id + '/paidStatus'] = isActive;
      dbFirebase.ref().update(updates).then(res => {
        console.log("Did the update paid status as webhook thing");
      }).catch(function (error) {
        console.log('Error updating paid status as webhook: ', error);
      });
      // usr = usr[Object.keys(usr)[0]];
    }
  });

  let docData: any = null;
  if(subscription && subscription.plan && subscription.plan.id){
    docData = {
      [subscription.plan.id]: isActive,
      [subscription.id]: subscription.status,
    }
  }

  return await db.doc(`users/${uid}`).set(docData, { merge: true });
};

export const invoiceWebhookEndpoint = functions.https.onRequest(
  async (req, res) => {
    try {
      const sig: any = req.headers['stripe-signature'];
      const event = stripe.webhooks.constructEvent(
        (req as any).rawBody,
        sig,
        stripeWebhookSignature
      );
      const data = event.data.object;

      await webhookHandler(data);

      res.sendStatus(200);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);
