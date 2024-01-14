import adminService from "../service/admin-service.js";

const createdDevice = async (req, res, next) => {
  try {
    const result = await adminService.registerDevice(req.body);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const result = await adminService.get();
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const createWaterSupplier = async (req, res, next) => {
  try {
    const request = req.body;
    const file = req.file;
    const result = await adminService.createWaterSupplier(file, request);
    res.status(200).json({ message: "Success" });
  } catch (e) {
    next(e);
  }
};

export default { createdDevice, get, createWaterSupplier };
