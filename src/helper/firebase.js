import admin from "firebase-admin";
import "dotenv/config";
// import serviceAccount from "../../bluesense-api-firebase.json" assert { type: "json" };
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
