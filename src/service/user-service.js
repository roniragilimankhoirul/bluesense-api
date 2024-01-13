import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  getUserValidation,
  registerUserValidation,
} from "../validation/user-validation.js";
import { validate } from "../helper/validation.js";
import admin from "../helper/firebase.js";

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  let firebaseUser;

  try {
    firebaseUser = await admin.auth().getUser(user.uid);
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      try {
        firebaseUser = await admin.auth().getUserByEmail(user.email);
      } catch (emailError) {
        throw new ResponseError(
          404,
          "User not found in Firebase Authentication"
        );
      }
    } else {
      throw new ResponseError(500, "Error checking Firebase user");
    }
  }

  const userInDatabase = await prismaClient.user.count({
    where: {
      email: user.email,
    },
  });

  if (userInDatabase === 1) {
    throw new ResponseError(409, "exist");
  }

  return await prismaClient.user.create({
    data: {
      name: user.name,
      email: user.email,
      firebase_id: firebaseUser.uid,
      photo_url: `https://ui-avatars.com/api/?size=128&background=0D8ABC&color=fff&name=${encodeURIComponent(
        user.name
      )}`,
    },
    select: {
      id: true,
      name: true,
      email: true,
      telp: true,
      firebase_id: true,
      photo_url: true,
      created_at: true,
      updated_at: true,
    },
  });
};

const get = async (request) => {
  const user = validate(getUserValidation, request);
  let firebaseUser;

  try {
    firebaseUser = await admin.auth().getUser(user.uid);
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      try {
        firebaseUser = await admin.auth().getUserByEmail(user.email);
      } catch (emailError) {
        throw new ResponseError(
          404,
          "User not found in Firebase Authentication"
        );
      }
    } else {
      throw new ResponseError(500, "Error checking Firebase user");
    }
  }
  const userInDatabase = await prismaClient.user.findUnique({
    where: {
      email: user.email,
    },
  });

  if (!userInDatabase) {
    throw new ResponseError(404, "user not found");
  }
  return userInDatabase;
};

export default {
  register,
  get,
};
