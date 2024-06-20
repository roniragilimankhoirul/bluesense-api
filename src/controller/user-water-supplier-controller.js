import { ResponseError } from "../error/response-error.js";
import userWaterSupplierService from "../service/user-water-supplier-service.js";
const register = async (req, res, next) => {
  try {
    await userWaterSupplierService.register(req.body);
    res.status(200).json({
      message: "Create new user water supplier success",
    });
  } catch (e) {
    next(e);
  }
};
const login = async (req, res, next) => {
  try {
    console.log(req.body);
    const result = await userWaterSupplierService.login(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};
const create = async (req, res, next) => {
  try {
    const request = req.body;
    request.id = req.user.uid;
    request.image = req.file;
    await userWaterSupplierService.create(request);
    res.status(200).json({
      message: "Added new water supplier success",
    });
  } catch (e) {
    next(e);
  }
};
const insert = async (req, res, next) => {
  try {
    const file = req.file.buffer;
    if (!file) {
      throw new ResponseError(404, "File not uploaded");
    }
    const result = await userWaterSupplierService.insert(file);
    res.status(200).json({
      message: "Added CSV data success",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};
const get = async (req, res, next) => {
  try {
    const id = req.user.uid;
    const result = await userWaterSupplierService.get(id);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};
export default {
  register,
  login,
  create,
  insert,
  get,
};
