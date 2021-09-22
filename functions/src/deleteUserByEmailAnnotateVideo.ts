import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// admin.initializeApp();

export const deleteUserByEmailAnnotateVideo = functions.https.onRequest(
    async (request, response) =>{
      const contentType = request.get("content-type");
      const userEmail: string = request.body.userEmail;
      await admin.auth().getUserByEmail(userEmail)
          .then((userRecord) => {
            const uid = userRecord.uid;
            return admin.auth().deleteUser(uid)
                .then(()=>{
                  response.status(200).send(
                      {message: "Deleted user: " + userEmail, ok: true}
                  );
                  return;
                }).catch((error) => {
                  console.log("Error is: ");
                  console.log(error);
                  response.status(500).send(
                      {error: "Failed to delete user (1): " + userEmail,
                        ok: false}
                  );
                });
          }).catch((error) =>{
            console.log("Error is: ");
            console.log(error);
            response.status(500).send(
                {error: "Failed to delete user (2): " + userEmail, ok: false}
            );
          });
    });
