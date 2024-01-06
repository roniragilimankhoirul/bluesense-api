import adminService from "../service/admin-service.js";

const createdDevice = async (req, res, next) => {
  try {
    console.log(req.body);
    const result = await adminService.registerDevice(req.body);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export default { createdDevice };
