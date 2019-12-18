import * as functions from 'firebase-functions';

/**
Validates data payload of a callable function
*/
export const assert = (data: any, key:string) => {
  console.log("entered assert");
  console.log(data);
  console.log(key);
    if (!data[key]) {
        console.log("data[key] DNE");
        throw new functions.https.HttpsError('invalid-argument', `function called without ${key} data`);
    } else {
      console.log("data[key] exists and is");
      console.log(data[key]);
      return data[key];
    }
}

/**
Validates auth context for callable function
*/
export const assertUID = (context: any) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('permission-denied', 'function called without context.auth');
    } else {
        return context.auth.uid;
    }
}

/**
Sends a descriptive error response when running a callable function
*/
export const catchErrors = async (promise: Promise<any>) => {
    try {
        return await promise;
    } catch(err) {
        throw new functions.https.HttpsError('unknown', err)
    }
}
