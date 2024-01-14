import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../helper/validation.js";
import {
  createDeviceAdminValidation,
  createWaterSupplierValidation,
} from "../validation/admin-validation.js";
import { imagekit } from "../helper/upload_image.js";
import fs from "fs/promises";
import path from "path";

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

const createWaterSupplier = async (file, request) => {
  const validatedRequest = validate(createWaterSupplierValidation, request);

  const waterSupplierInDatabase = await prismaClient.waterSupplier.count({
    where: {
      OR: [
        {
          phone: validatedRequest.phone,
        },
        {
          instagram_url: validatedRequest.instagram_url,
        },
      ],
    },
  });

  if (waterSupplierInDatabase === 1) {
    throw new ResponseError(409, "Already Exist");
  }

  const uploadResponse = await imagekit.upload({
    file: file.buffer.toString("base64"),
    fileName: `${validatedRequest.name}_photo.jpg`,
  });

  await prismaClient.waterSupplier.create({
    data: {
      ...validatedRequest,
      image_url: uploadResponse.url,
    },
  });
};

export default {
  registerDevice,
  get,
  createWaterSupplier,
};

// const __filename = new URL(import.meta.url).pathname;
// const __dirname = path.dirname(__filename);

// const createWaterSupplier = async (file, request) => {
//   const validatedRequest = validate(createWaterSupplierValidation, request);
//   console.log(validatedRequest);

//   const waterSupplierInDatabase = await prismaClient.waterSupplier.count({
//     where: {
//       OR: [
//         {
//           phone: validatedRequest.phone,
//         },
//         {
//           instagram_url: validatedRequest.instagram_url,
//         },
//       ],
//     },
//   });

//   if (waterSupplierInDatabase === 1) {
//     throw new ResponseError(409, "Already Exist");
//   }

//   const createdWaterSupplier = await prismaClient.waterSupplier.create({
//     data: {
//       ...validatedRequest,
//       image_url: "xxx",
//     },
//   });

//   const folderPath = path.join(__dirname, "../../images/water-supplier");
//   await fs.mkdir(folderPath, { recursive: true });

//   const imageUrl = path.join(folderPath, `${createdWaterSupplier.id}.jpg`);
//   const buffer = await sharp(file.path)
//     .toFormat("jpeg")
//     .jpeg({ quality: 90 })
//     .toBuffer();
//   await fs.writeFile(imageUrl, buffer);
//   await prismaClient.waterSupplier.update({
//     where: { id: createdWaterSupplier.id },
//     data: { image_url: imageUrl },
//   });
// };
