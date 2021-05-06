import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

export const deleteUserByEmail = functions.https.onRequest(async (request, response) =>{
    const userEmail = request.body.userEmail;
    await admin.auth().getUserByEmail(userEmail)
    .then(function (userRecord){
        console.log('Successfully deteled user: ' + userEmail);
        response.status(200).send('Deleted user ' + userEmail);
    }).catch(function (error){
        console.log('Error deleting user: ', error);
        response.status(500).send('Failed to delete user: ' + userEmail);
    });
});