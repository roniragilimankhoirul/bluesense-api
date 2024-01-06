import userService from "../service/user-service.js";

const register = async (req, res, next) => {
  try {
    const request = {};
    request.name = req.body.name;
    request.uid = req.user.uid;
    request.email = req.user.email;
    console.log(request);
    const result = await userService.register(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const request = {};
    request.uid = req.user.uid;
    request.email = req.user.email;
    console.log(request);
    const result = await userService.get(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  register,
  get,
};
