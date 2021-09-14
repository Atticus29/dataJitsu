import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// admin.initializeApp();

export const deleteUserByEmailAnnotateVideo = functions.https.onRequest(
    async (request, response) =>{
      console.log("deleteMe request.body is: ");
      console.log(request.body);
      const contentType = request.get("content-type");
      console.log("deleteMe contentType is: " + contentType);
      const userEmail: string = request.body.userEmail;
      console.log("deleteMe userEmail is: " + userEmail);
      await admin.auth().getUserByEmail(userEmail)
          .then((userRecord) => {
            const uid = userRecord.uid;
            console.log("deleteMe uid is: " + uid);
            return admin.auth().deleteUser(uid)
                .then(()=>{
                  console.log("deleteMe heyo deleted user!");
                  response.status(200).send(
                      {message: "Deleted user: " + userEmail, ok: true}
                  );
                  return;
                }).catch((error) => {
                  console.log("deleteMe error is: ");
                  console.log(error);
                  response.status(500).send(
                      {error: "Failed to delete user (1): " + userEmail,
                        ok: false}
                  );
                });
          }).catch((error) =>{
            console.log("deleteMe error is: ");
            console.log(error);
            response.status(500).send(
                {error: "Failed to delete user (2): " + userEmail, ok: false}
            );
          });
    });
