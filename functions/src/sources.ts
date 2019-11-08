import * as functions from 'firebase-functions';
import { assert, assertUID, catchErrors } from './helpers';
import { stripe } from './config';
import { getOrCreateCustomer } from './customers';

/** Attaches a payment source to a stripe customer account**/

export const attachSource = async (uid: string, source: string) =>{
  const customer = await getOrCreateCustomer(uid);
  const existingSource = customer.sources.data.filter(s => s.id === source).pop();
  if(existingSource){
    return existingSource;
  } else {
    await stripe.customers.createSource(customer.id, {source: source});
    return await stripe.customers.update(customer.id, {default_source: source});
  }
}

/////// DEPLOYABLE FUNCTIONS ////////
export const stripeAttachSource = functions.https.onCall( async(data, context) =>{
  const uid = assertUID(context);
  const source = assert(data, 'source');
  return catchErrors(attachSource(uid, source));
});
