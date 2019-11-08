import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const testFunction = functions.https.onCall( async (data, context) => {
    const uid  = context.auth && context.auth.uid;
    const message = data.message;

    return `${uid} sent a message of ${message}`
});

export { stripeAttachSource } from './sources';
