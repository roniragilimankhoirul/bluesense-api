import admin from "firebase-admin";
import "dotenv/config";
// import serviceAccount from "../../bluesense.json" assert { type: "json" };
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
