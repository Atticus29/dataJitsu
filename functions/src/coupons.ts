import { stripe } from './config';
import { assert, catchErrors } from './helpers';

import * as functions from 'firebase-functions';

/** Returns a coupon from Stipe */
export function getCoupon(coupon: string){
  console.log("getCoupon entered");
  console.log(coupon);
  return stripe.coupons.retrieve(coupon);
}

export const stripeGetCoupon = functions.https.onCall(async (data, context) =>{
  console.log("stripeGetCoupon entered");
  console.log(data);
  console.log(context);
  const coupon = assert(data, 'coupon');
  console.log(coupon);
  return catchErrors(getCoupon(coupon));
});
