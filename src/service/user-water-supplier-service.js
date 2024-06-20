import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import admin from "../helper/firebase.js";
import { validate } from "../helper/validation.js";
import {
  createWaterSupplierValidation,
  getWaterSupplierValidation,
  loginUserWaterSupplierValidation,
  registerUserWaterSupplierValidation,
} from "../validation/user-water-supplier-validation.js";
import fetch from "node-fetch";
import { imagekit } from "../helper/upload_image.js";
import csvParser from "csv-parser";
import { BufferStream } from "../helper/stream.js";
import { Readable } from "stream";

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

const create = async (request) => {
  const userCreateRequest = validate(createWaterSupplierValidation, request);
  try {
    const uploadResponse = await imagekit.upload({
      file: userCreateRequest.image.buffer.toString("base64"),
      fileName: `${userCreateRequest.name}_photo.jpg`,
    });
    await prismaClient.waterSupplier.create({
      data: {
        id_user_water_supplier: userCreateRequest.id,
        latitude: userCreateRequest.latitude,
        longitude: userCreateRequest.latitude,
        detail_location: userCreateRequest.detail_location,
        name: userCreateRequest.name,
        phone: userCreateRequest.phone,
        image_url: uploadResponse.url,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const insert = async (fileBuffer) => {
  const results = [];

  const readableStream = Readable.from(fileBuffer);

  await new Promise((resolve, reject) => {
    readableStream
      .pipe(csvParser())
      .on("data", async (data) => {
        try {
          const ph = parseFloat(data.ph);
          const tds = parseInt(data.tds);
          const datetime = new Date(data.datetime);
          await prismaClient.waterSupplierLog.create({
            data: {
              ph,
              tds,
              datetime,
            },
          });
          results.push(data);
        } catch (error) {
          reject(error);
        }
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (error) => {
        reject(error);
      });
  });

  return results;
};

const get = async (request) => {
  const user = validate(getWaterSupplierValidation, request);
  const userInDatabase = await prismaClient.waterSupplier.findUnique({
    where: {
      id_user_water_supplier: user,
    },
  });
  if (!userInDatabase) {
    throw new ResponseError(404, "User not Found");
  }
  return userInDatabase;
};

export default { register, login, create, insert, get };
