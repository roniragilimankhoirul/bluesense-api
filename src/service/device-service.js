import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../helper/validation.js";
import { registerDevice } from "../validation/device-validation.js";

const register = async (request) => {
  const device = validate(registerDevice, request);
  const userInDatabase = await prismaClient.user.findUnique({
    where: {
      email: request.email,
    },
  });
  if (!userInDatabase) {
    throw new ResponseError(404, "User Not Found");
  }

  console.log(userInDatabase);
  const deviceInDatabase = await prismaClient.device.findUnique({
    where: {
      device_id: device.device_id,
    },
  });

  console.log(deviceInDatabase);

  if (!deviceInDatabase) {
    throw new ResponseError(404, "Device Not Found");
  }

  const userDevice = await prismaClient.userDevice.create({
    data: {
      user: {
        connect: {
          id: userInDatabase.id,
        },
      },
      device: {
        connect: {
          id: deviceInDatabase.id,
        },
      },
    },
  });

  const deviceDetail = await prismaClient.deviceDetail.create({
    data: {
      device_id: deviceInDatabase.device_id,
      name: request.name,
      province: request.province,
      city: request.city,
      address: request.address,
      water_source: request.water_source,
      user_device_id: userDevice.id,
    },
  });
};

export default {
  register,
};
