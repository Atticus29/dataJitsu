import { assert } from './helpers';
import { db, stripe } from './config';

/**
Read the user document from Firestore
*/
export const getUser = async(uid: string) => {
  console.log('entered getUser');
  console.log(uid);
  const returnDoc = await db.collection('users').doc(uid).get().then(doc => doc.data());
  console.log("returnDoc is:");
  console.log(returnDoc);
  return returnDoc;
}

/**
Gets a customer from Stripe
*/
export const getCustomer = async(uid: string) => {
    console.log("entered getCustomer");
    console.log("uid is : " + uid);
    const user = await getOrCreateCustomer(uid);
    console.log("user after getUser (function call is back in getCustomer now)");
    console.log(user);
    if(user){
      console.log("user in getCustomer is:");
      console.log(user);
      return assert(user, 'id'); //used to be stripeCustomerId
    } else{
      console.log("uh oh! User didn't exist in getCustomer");
      const customer = await createCustomer(uid);
      return assert(customer, 'id'); //used to be stripeCustomerId
    }
    console.log("user after getUser (function call is back in getCustomer now)");
    console.log(user);
}

/**
Updates the user document non-destructively
*/
export const updateUser = async(uid: string, data: Object) => {
    return await db.collection('users').doc(uid).set(data, { merge: true })
}

/**
Takes a Firebase user and creates a Stripe customer account
*/
export const createCustomer = async(uid: any) => {
    const customer = await stripe.customers.create({
        metadata: { firebaseUID: uid }
    })

    await updateUser(uid, { stripeCustomerId: customer.id })

    return customer;
}



/**
Read the stripe customer ID from firestore, or create a new one if missing
*/
export const getOrCreateCustomer = async(uid: string) => {

    const user = await getUser(uid);
    const customerId = user && user.stripeCustomerId;

    // If missing customerID, create it
    if (!customerId) {
        return createCustomer(uid);
    } else {
        return stripe.customers.retrieve(customerId);
    }

}
