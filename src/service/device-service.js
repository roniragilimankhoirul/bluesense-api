import { request } from "express";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../helper/validation.js";
import {
  createDeviceLogsValidation,
  deleteDeviceValidation,
  getDeviceLogsValidation,
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
      district: request.district,
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

  const userDevices = await prismaClient.userDevice.findMany({
    where: {
      user_id: userInDatabase.id,
    },
    include: {
      device: true,
      device_detail: true,
    },
  });

  const filteredUserDevices = userDevices.filter(
    (device) => device.device_detail !== null
  );

  return filteredUserDevices;
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

const getDeviceLogs = async (request) => {
  const user = validate(getDeviceLogsValidation, request);

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
      id: user.device_id,
    },
  });

  if (!deviceInDatabase) {
    throw new ResponseError(404, "Device Not Found");
  }

  // Fetch the latest log for the device
  const latestLog = await prismaClient.log.findFirst({
    where: {
      device_id: user.device_id,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const averageTDS = latestLog ? latestLog.tds : 0;
  const averagePH = latestLog ? latestLog.ph : 0;

  let status = "aman";

  if (
    !(averageTDS <= 1500 && averagePH >= 6.5 && averagePH <= 9.0) ||
    !(averageTDS <= 500 && averagePH >= 6.5 && averagePH <= 8.5)
  ) {
    status = "buruk";
  }

  let quality = "baik";
  if (averageTDS > 1500 || averagePH < 6.5 || averagePH > 9.0) {
    quality = "buruk";
  }

  let drinkable = "yes";
  if (averageTDS > 500 || averagePH < 6.5 || averagePH > 8.5) {
    drinkable = "no";
  }

  const response = {
    status,
    quality,
    drinkable,
    log: latestLog
      ? {
          ph: latestLog.ph,
          tds: latestLog.tds,
          created_at: latestLog.created_at.toISOString(),
        }
      : null,
  };

  return response;
};

export default {
  register,
  deleteDeviceById,
  getUserDevice,
  createDeviceLogs,
  getDeviceLogs,
};
