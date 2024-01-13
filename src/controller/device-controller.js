import deviceService from "../service/device-service.js";

const register = async (req, res, next) => {
  try {
    const request = req.body;
    request.email = req.user.email;
    const result = await deviceService.register(request);
    res.status(200).json({ message: "succes" });
  } catch (e) {
    next(e);
  }
};

const deleteDeviceById = async (req, res, next) => {
  try {
    const request = {};
    request.id = req.params.id;
    request.email = req.user.email;
    const result = await deviceService.deleteDeviceById(request);
    res.status(200).json({ message: "succes" });
  } catch (e) {
    next(e);
  }
};

const getUserDevice = async (req, res, next) => {
  try {
    const request = {};
    request.uid = req.user.uid;
    request.email = req.user.email;
    const result = await deviceService.getUserDevice(request);
    res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
};

const createDeviceLogs = async (req, res, next) => {
  try {
    const request = req.body;
    request.email = req.user.email;
    const result = await deviceService.createDeviceLogs(request);
    res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
};

const geteDeviceLogs = async (req, res, next) => {
  try {
    const request = {};
    request.email = req.user.email;
    request.device_id = req.params.device_id;
    const result = await deviceService.getDeviceLogs(request);
    res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
};
const geteDeviceLogsHistory = async (req, res, next) => {
  try {
    const request = {};
    request.email = req.user.email;
    request.device_id = req.params.device_id;
    request.startDateTime = req.params.startDateTime;
    request.endDateTime = req.params.endDateTime;
    const result = await deviceService.getDeviceLogsHistory(request);
    res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
};
export default {
  register,
  deleteDeviceById,
  getUserDevice,
  createDeviceLogs,
  geteDeviceLogs,
  geteDeviceLogsHistory,
};
