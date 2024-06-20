import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import admin from "../helper/firebase.js";
import { validate } from "../helper/validation.js";
import {
  loginUserWaterSupplierValidation,
  registerUserWaterSupplierValidation,
} from "../validation/user-water-supplier-validation.js";
import fetch from "node-fetch";

const register = async (request) => {
  const userRequest = validate(registerUserWaterSupplierValidation, request);
  let firebase;

  try {
    const userInDatabase = await prismaClient.userWaterSupplier.count({
      where: {
        email: userRequest.email,
      },
    });
    if (userInDatabase !== 0) {
      throw new ResponseError(409, "User Already exists");
    }

    firebase = await admin.auth().createUser({
      email: userRequest.email,
      password: userRequest.password,
    });

    await prismaClient.userWaterSupplier.create({
      data: {
        id: firebase.uid,
        email: firebase.email,
      },
    });
  } catch (error) {
    if (firebase && firebase.uid) {
      try {
        await admin.auth().deleteUser(firebase.uid);
      } catch (firebaseError) {
        console.error(
          "Error deleting Firebase user after PostgreSQL failure:",
          firebaseError
        );
      }
    }

    if (error.code === "auth/email-already-exists") {
      throw new ResponseError(
        409,
        "The email address is already in use by another account."
      );
    }

    if (
      error.code === "auth/invalid-email" ||
      error.code === "auth/weak-password"
    ) {
      throw new ResponseError(400, "Invalid email or weak password.");
    }

    console.error("Error registering admin:", error);
    throw new ResponseError(500, "Internal Server Error");
  }
};

const login = async (request) => {
  const userLoginRequest = validate(loginUserWaterSupplierValidation, request);

  try {
    const userInDatabase = await prismaClient.userWaterSupplier.count({
      where: {
        email: userLoginRequest.email,
      },
    });

    if (userInDatabase === 0) {
      throw new ResponseError(404, "User does not exist");
    }

    const apiKey = process.env.API_KEY;
    const response = await fetch(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userLoginRequest.email,
          password: userLoginRequest.password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      throw new ResponseError(
        response.status,
        `Failed to login: ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.idToken) {
      throw new ResponseError(500, "ID token not found in response");
    }

    return { token: data.idToken };
  } catch (error) {
    console.error("Error logging in:", error.message);
    throw new ResponseError(500, "Login failed");
  }
};
export default { register, login };
