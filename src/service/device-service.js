import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../helper/validation.js";
import {
  createDeviceLogsValidation,
  deleteDeviceValidation,
  getDeviceLogsHistoryValidation,
  getDeviceLogsValidation,
  getDeviceValidation,
  registerDevice,
} from "../validation/device-validation.js";
import admin from "../helper/firebase.js";
import "dotenv/config";

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
  const deviceInDatabase = await prismaClient.device.findUnique({
    where: {
      device_id: user.device_id,
    },
  });
  if (!deviceInDatabase) {
    throw new ResponseError(404, "Device Not Found");
  }

  const response = await prismaClient.log.create({
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

  const latestLog = await prismaClient.log.findFirst({
    where: {
      device_id: deviceInDatabase.id,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  console.log(latestLog);

  const averageTDS = latestLog ? latestLog.tds : 0;
  const averagePH = latestLog ? latestLog.ph : 0;

  let status = "aman";

  if (
    !(averageTDS <= 1500 && averagePH >= 6.5 && averagePH <= 9.0) ||
    !(averageTDS <= 500 && averagePH >= 6.5 && averagePH <= 8.5)
  ) {
    status = "buruk";

    if (status === "buruk") {
      const message = {
        to: `/topics/${deviceInDatabase.device_id}`,
        notification: {
          title: "Air Buruk!",
          body: "Penting! Kualitas air saat ini menunjukkan tingkat yang tidak memadai.",
          subTitle: new Date().toISOString(),
        },
      };
      console.log(message);
      const fcmKey = process.env.FCM_KEY;
      const apiUrl = "https://fcm.googleapis.com/fcm/send";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: fcmKey,
        },
        body: JSON.stringify(message),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(`Failed to send FCM message: ${result.error}`);
      }
    }
  }

  return response;
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

const getDeviceLogsHistory = async (req) => {
  const request = validate(getDeviceLogsHistoryValidation, req);

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
      id: request.device_id,
    },
  });

  if (!deviceInDatabase) {
    throw new ResponseError(404, "Device Not Found");
  }

  let startDate, endDate;

  switch (request.time) {
    case "week":
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      endDate = new Date();
      break;
    case "month":
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      endDate = new Date();
      break;
    case "year":
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      endDate = new Date();
      break;
    default:
      startDate = new Date(
        request.startDateTime || new Date().setHours(0, 0, 0, 0)
      );
      endDate = new Date(request.endDateTime || new Date());
  }

  const logs = await prismaClient.log.findMany({
    where: {
      device_id: request.device_id,
      created_at: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  if (logs.length === 0) {
    return {
      message: "No logs available for the specified time range",
      average_ph: 0,
      average_tds: 0,
      min_ph: 0,
      max_ph: 0,
      min_tds: 0,
      max_tds: 0,
      average_quality: "Unknown",
      average_status: "Unknown",
      average_drinkable: "Unknown",
      logs: [],
    };
  }

  const totalLogs = logs.length;
  const totalPh = logs.reduce((sum, log) => sum + log.ph, 0);
  const totalTDS = logs.reduce((sum, log) => sum + log.tds, 0);

  const averagePh = totalPh / totalLogs;
  const averageTDS = totalTDS / totalLogs;

  const minPh = Math.min(...logs.map((log) => log.ph));
  const maxPh = Math.max(...logs.map((log) => log.ph));

  const minTDS = Math.min(...logs.map((log) => log.tds));
  const maxTDS = Math.max(...logs.map((log) => log.tds));

  const averageStatus = calculateAverage(logs, (log) => getStatus(log));
  const averageQuality = calculateAverage(logs, (log) => getQuality(log));
  const averageDrinkable = calculateAverage(logs, (log) => getDrinkable(log));

  const response = {
    average_ph: averagePh,
    average_tds: averageTDS,
    min_ph: minPh,
    max_ph: maxPh,
    min_tds: minTDS,
    max_tds: maxTDS,
    average_quality: getQualityString(averageQuality),
    average_status: getStatusString(averageStatus),
    average_drinkable: getDrinkableString(averageDrinkable),
    logs: logs.map((log) => ({
      ph: log.ph,
      tds: log.tds,
      created_at: log.created_at.toISOString(),
      quality: getQuality(log) === "baik" ? 1 : 0,
      status: getStatus(log) === "aman" ? 1 : 0,
    })),
  };

  return response;
};

function calculateAverage(logs, getValue) {
  const totalValue = logs.reduce((sum, log) => sum + getValue(log), 0);
  return totalValue / logs.length;
}

function getStatus(log) {
  const averageTDS = log.tds;
  const averagePH = log.ph;

  return !(averageTDS <= 1500 && averagePH >= 6.5 && averagePH <= 9.0) ||
    !(averageTDS <= 500 && averagePH >= 6.5 && averagePH <= 8.5)
    ? "buruk"
    : "aman";
}

function getQuality(log) {
  const averageTDS = log.tds;
  const averagePH = log.ph;

  return averageTDS > 1500 || averagePH < 6.5 || averagePH > 9.0
    ? "buruk"
    : "baik";
}

function getDrinkable(log) {
  const averageTDS = log.tds;
  const averagePH = log.ph;

  return averageTDS > 500 || averagePH < 6.5 || averagePH > 8.5 ? "no" : "yes";
}

function getStatusString(value) {
  return value === 1 ? "aman" : "buruk";
}

function getDrinkableString(value) {
  return value === 1 ? "yes" : "no";
}

function getQualityString(value) {
  return value === 1 ? "baik" : "buruk";
}

export default {
  register,
  deleteDeviceById,
  getUserDevice,
  createDeviceLogs,
  getDeviceLogs,
  getDeviceLogsHistory,
};
