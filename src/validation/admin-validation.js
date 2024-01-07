import Joi from "joi";

const createDeviceAdminValidation = Joi.object({
  device_id: Joi.string().max(100).required(),
  mqtt_topic: Joi.string().max(100).required(),
  mqtt_base_url: Joi.string().max(100).required(),
});

export { createDeviceAdminValidation };
