import admin from "firebase-admin";

const requireAuth = async (req, res, next) => {
  const idToken = req.headers.authorization;
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    req.user = decodedToken;

    next();
  } catch (error) {
    console.error("Firebase Authentication Error:", error.message);
    res.status(401).json({ error: "Invalid ID token" });
  }
};

export default requireAuth;
