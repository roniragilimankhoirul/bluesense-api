import express from "express";
import userController from "../controller/user-controller.js";
import requireAuth from "../middleware/auth-middleware.js";

const publicRouter = new express.Router();

publicRouter.get("/", (req, res) => {
  res.status(200).json({
    message: "Konichiwa, Hackfest",
  });
});

publicRouter.post("/api/users/register", requireAuth, userController.register);
publicRouter.get("/api/users", requireAuth, userController.get);

export { publicRouter };
