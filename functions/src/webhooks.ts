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
      let usr = snapshot.val();
      let usrId = Object.keys(usr)[0];
      let updates = {};
      updates['/users/' + id + '/paidStatus'] = isActive;
      dbFirebase.ref().update(updates);
      // usr = usr[Object.keys(usr)[0]];
    }
  });

  const docData = {
    [subscription.plan.id]: isActive,
    [subscription.id]: subscription.status,
  }

  return await db.doc(`users/${uid}`).set(docData, { merge: true });
};

export const invoiceWebhookEndpoint = functions.https.onRequest(
  async (req, res) => {
    try {
      const sig = req.headers['stripe-signature'];
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
