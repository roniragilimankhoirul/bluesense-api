import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../helper/validation.js";
import { createDeviceAdminValidation } from "../validation/admin-validation.js";

const registerDevice = async (request) => {
  const device = validate(createDeviceAdminValidation, request);
  const deviceInDatabase = await prismaClient.device.count({
    where: {
      device_id: device.device_id,
    },
  });
  if (deviceInDatabase === 1) {
    throw new ResponseError(409, "Device Already Exist");
  }
  return prismaClient.device.create({
    data: device,
  });
};

const get = async () => {
  return await prismaClient.device.findMany();
};
export default {
  registerDevice,
  get,
};
