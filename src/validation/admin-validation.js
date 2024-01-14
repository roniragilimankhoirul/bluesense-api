import Joi from "joi";
import { isNumericString } from "../helper/numeric-validation.js";
const telpErr = {
  "string.numeric": "telp must only contain numeric characters",
};

const createDeviceAdminValidation = Joi.object({
  device_id: Joi.string().max(100).required(),
  mqtt_topic: Joi.string().max(100).required(),
  mqtt_base_url: Joi.string().max(100).required(),
});

const createWaterSupplierValidation = Joi.object({
  name: Joi.string().max(100).required(),
  category: Joi.string().max(100).required(),
  phone: Joi.string()
    .max(15)
    .min(10)
    .custom(isNumericString, "custom validation")
    .messages(telpErr),
  instagram_url: Joi.string().max(100),
  // image_url: Joi.string().max(100).required(),
});

const createWaterFilterValidation = Joi.object({
  name: Joi.string().max(100).required(),
  price: Joi.number().required(),
  rating: Joi.number().required(),
  description: Joi.string().required(),
  tokopedia_url: Joi.string(),
  shoppe_url: Joi.string(),
});

const getWaterSupplierValidation = Joi.string().email().required();
const getWaterFilterValidation = Joi.string().email().required();

export {
  createDeviceAdminValidation,
  createWaterSupplierValidation,
  createWaterFilterValidation,
  getWaterSupplierValidation,
  getWaterFilterValidation,
};
