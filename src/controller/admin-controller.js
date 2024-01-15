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
const createWaterFilter = async (req, res, next) => {
  try {
    const request = req.body;
    const file = req.file;
    console.log(request);
    const result = await adminService.createWaterFilter(file, request);
    res.status(200).json({ message: "Success" });
  } catch (e) {
    next(e);
  }
};

const getWaterSupplier = async (req, res, next) => {
  try {
    const result = await adminService.getWaterSupplier(req.user.email);
    res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
};
const getWaterFilter = async (req, res, next) => {
  try {
    const request = {};
    request.email = req.user.email;
    request.featured = req.params.featured;
    const result = await adminService.getWaterFilter(request);
    res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
};
const getWaterFilterById = async (req, res, next) => {
  try {
    const request = {};
    request.email = req.user.email;
    request.id = req.params.id;
    const result = await adminService.getWaterFilterById(request);
    res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
};

export default {
  createdDevice,
  get,
  createWaterSupplier,
  createWaterFilter,
  getWaterSupplier,
  getWaterFilter,
  getWaterFilterById,
};
