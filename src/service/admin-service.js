import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  getUserValidation,
  registerUserValidation,
} from "../validation/user-validation.js";
import { validate } from "../helper/validation.js";
import admin from "../helper/firebase.js";
import QRCode from "qrcode";
import { createDeviceAdminValidation } from "../validation/admin-validation.js";

const registerDevice = async (request) => {
  const device = validate(createDeviceAdminValidation, request);

  return prismaClient.device.create({
    data: device,
  });
};
export default {
  registerDevice,
};
