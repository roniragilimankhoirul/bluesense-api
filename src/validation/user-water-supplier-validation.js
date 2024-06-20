import Joi from "joi";

const registerUserWaterSupplierValidation = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().email().max(100).required(),
});
const loginUserWaterSupplierValidation = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().email().max(100).required(),
});

export {
  registerUserWaterSupplierValidation,
  loginUserWaterSupplierValidation,
};
