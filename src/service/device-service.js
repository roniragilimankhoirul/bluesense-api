import { request } from "express";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../helper/validation.js";
import {
  createDeviceLogsValidation,
  deleteDeviceValidation,
  getDeviceValidation,
  registerDevice,
} from "../validation/device-validation.js";

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

  const deviceInDatabase = await prismaClient.device.findUnique({
    where: {
      device_id: device.device_id,
    },
  });

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

const deleteDeviceById = async (request) => {
  const user = validate(deleteDeviceValidation, request);

  const userInDatabase = await prismaClient.user.findUnique({
    where: {
      email: user.email,
    },
  });

  if (!userInDatabase) {
    throw new ResponseError(404, "User Not Found");
  }

  const userDeviceInDatabase = await prismaClient.userDevice.findUnique({
    where: {
      id: user.id,
    },
    include: {
      device_detail: true,
    },
  });

  if (!userDeviceInDatabase) {
    throw new ResponseError(404, "UserDevice Not Found");
  }

  if (userDeviceInDatabase.device_detail) {
    await prismaClient.deviceDetail.delete({
      where: {
        id: userDeviceInDatabase.device_detail.id,
      },
    });
  }

  await prismaClient.userDevice.delete({
    where: {
      id: userDeviceInDatabase.id,
    },
  });
};

const getUserDevice = async (request) => {
  const user = validate(getDeviceValidation, request);

  const userInDatabase = await prismaClient.user.findUnique({
    where: {
      email: user.email,
    },
  });

  if (!userInDatabase) {
    throw new ResponseError(404, "User Not Found");
  }

  return await prismaClient.userDevice.findMany({
    where: {
      user_id: userInDatabase.id,
    },
    include: {
      device_detail: true,
    },
  });
};

const createDeviceLogs = async (request) => {
  const user = validate(createDeviceLogsValidation, request);
  const userInDatabase = await prismaClient.user.findUnique({
    where: {
      email: user.email,
    },
  });

  if (!userInDatabase) {
    throw new ResponseError(404, "User Not Found");
  }

  const deviceInDatabase = await prismaClient.device.findUnique({
    where: {
      device_id: user.device_id,
    },
  });
  console.log(deviceInDatabase);
  if (!deviceInDatabase) {
    throw new ResponseError(404, "Device Not Found");
  }
  return await prismaClient.log.create({
    data: {
      ph: user.ph,
      tds: user.tds,
      device: {
        connect: {
          id: deviceInDatabase.id,
        },
      },
    },
  });
};

export default {
  register,
  deleteDeviceById,
  getUserDevice,
  createDeviceLogs,
};
