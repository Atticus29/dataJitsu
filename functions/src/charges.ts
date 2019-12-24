import * as functions from 'firebase-functions';
import { assert, assertUID, catchErrors } from './helpers';
import { stripe } from './config';
import { getCustomer } from './customers'; //getOrCreateCustomer
import { attachSource } from './sources';

/**
Gets a user's charge history
*/
export const getUserCharges = async(uid: string, limit?: number) => {
  console.log("entered getUserCharges");
  console.log("uid is " + uid);
  console.log("limit is " + limit);
  const customer = await getCustomer(uid);
  console.log("customer after customer await in getUserCharges:");
  console.log(customer);
  return await stripe.charges.list({
      limit,
      customer
  });
}

/**
Creates a charge for a specific amount
*/
export const createCharge = async(uid: string, source: string, amount: number, idempotency_key?: string) => {
  console.log("createCharge entered");
  const customer = await getCustomer(uid);
  // const customer = await getOrCreateCustomer(uid);
  let customerId: string = customer.id;
  console.log("customer");
  console.log(customer);
  // console.log("customerId");
  // console.log(customerId);
  await attachSource(uid, source);

  // return null;

  return stripe.charges.create({
          amount,
          customer,
          source,
          currency: 'usd',
      },

      { idempotency_key }
   )
}


/////// DEPLOYABLE FUNCTIONS ////////

export const stripeCreateCharge = functions.https.onCall( async (data, context) => {
  console.log("stripeCreateCharge called");
  console.log("data in stripeCreateCharge: ");
  console.log(data);
  const uid = assertUID(context);
  console.log("uid");
  console.log(uid);
  const source = assert(data, 'source');
  console.log("source");
  console.log(source);
  const amount = assert(data, 'amount');
  console.log("amount");
  console.log(amount);

  // Optional
  const idempotency_key = data.itempotency_key;

  return catchErrors( createCharge(uid, source, amount, idempotency_key) );
});


export const stripeGetCharges = functions.https.onCall( async (data, context) => {
    const uid = assertUID(context);
    return catchErrors( getUserCharges(uid) );
});
