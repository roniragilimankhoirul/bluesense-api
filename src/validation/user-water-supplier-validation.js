import Joi from "joi";

const registerUserWaterSupplierValidation = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().email().max(100).required(),
});
const loginUserWaterSupplierValidation = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().email().max(100).required(),
});

const createWaterSupplierValidation = Joi.object({
  id: Joi.string().max(100).required(),
  name: Joi.string().max(100).required(),
  phone: Joi.string().max(15).required(),
  detail_location: Joi.string().required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  image: Joi.required(),
});
const getWaterSupplierValidation = Joi.string().required();

export {
  registerUserWaterSupplierValidation,
  loginUserWaterSupplierValidation,
  createWaterSupplierValidation,
  getWaterSupplierValidation,
};
