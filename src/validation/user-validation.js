import Joi from "joi";
import { isNumericString } from "../helper/numeric-validation.js";
const telpErr = {
  "string.numeric": "telp must only contain numeric characters",
};

const registerUserValidation = Joi.object({
  uid: Joi.string().max(100).required(),
  name: Joi.string().max(100),
  email: Joi.string().email().max(100).required(),
});

const getUserValidation = Joi.object({
  uid: Joi.string().max(100).required(),
  email: Joi.string().email().max(100).required(),
});
const userForgotPasswordValidation = Joi.object({
  email: Joi.string().email().max(100).required(),
});

export {
  registerUserValidation,
  getUserValidation,
  userForgotPasswordValidation,
};
