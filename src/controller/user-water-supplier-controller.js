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
    const file = req.file;
    await userWaterSupplierService.create(file, request);
    res.status(200).json({
      message: "Added new water supplier success",
    });
  } catch (e) {
    next(e);
  }
};
export default {
  register,
  login,
  create,
};
