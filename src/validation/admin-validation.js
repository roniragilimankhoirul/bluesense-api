import Joi from "joi";

const createDeviceAdminValidation = Joi.object({
  device_id: Joi.string().max(100).required(),
});

export { createDeviceAdminValidation };
