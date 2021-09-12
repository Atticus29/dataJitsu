import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// admin.initializeApp();

export const deleteUserByEmailAnnotateVideo = functions.https.onRequest(async (request, response) =>{
      const userEmail = request.body.userEmail;
      await admin.auth().getUserByEmail(userEmail)
      .then(userRecord => {
          const uid = userRecord.uid;
          return admin.auth().deleteUser(uid)
          .then(()=>{
            response.status(200).send('Deleted user: ' + userEmail);
            return;
          }).catch(error => {
            response.status(500).send('Failed to delete user (1): ' + userEmail);
          });
      }).catch(error =>{
        response.status(500).send('Failed to delete user (2): ' + userEmail);
      });
});
