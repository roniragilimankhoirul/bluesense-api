import admin from "firebase-admin";
import serviceAccount from "/mnt/Abazure/default/bluesense-api/bluesense-api-firebase.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Rest of your code

export default admin;
