import express from "express";
import userController from "../controller/user-controller.js";
import requireAuth from "../middleware/auth-middleware.js";
import adminController from "../controller/admin-controller.js";
import deviceController from "../controller/device-controller.js";
import { upload } from "../helper/upload_image.js";
import userWaterSupplierController from "../controller/user-water-supplier-controller.js";

const publicRouter = new express.Router();

publicRouter.get("/", (req, res) => {
  res.status(200).json({
    message: "Konichiwa, Hackfest",
  });
});

publicRouter.post("/api/users/register", requireAuth, userController.register);
publicRouter.get("/api/users", requireAuth, userController.get);

publicRouter.post("/api/admin", adminController.createdDevice);
publicRouter.get("/api/admin/data", adminController.get);

publicRouter.post("/api/devices", requireAuth, deviceController.register);
publicRouter.get("/api/devices", requireAuth, deviceController.getUserDevice);
publicRouter.delete(
  "/api/devices/:id",
  requireAuth,
  deviceController.deleteDeviceById
);
publicRouter.post("/api/devices/logs", deviceController.createDeviceLogs);
publicRouter.get(
  "/api/devices/logs/:device_id",
  requireAuth,
  deviceController.geteDeviceLogs
);

publicRouter.get(
  "/api/devices/history/:device_id/:time?",
  requireAuth,
  deviceController.geteDeviceLogsHistory
);

publicRouter.get("/api/admin/register-devices", (req, res) => {
  res.render("admin-register-device");
});
publicRouter.get("/api/admin/device-data", (req, res) => {
  res.render("admin-device-data");
});
publicRouter.get("/api/admin/login", (req, res) => {
  res.render("admin-login");
});
publicRouter.get("/api/admin/register-water-suppliers", (req, res) => {
  res.render("admin-register-water-suppliers");
});
publicRouter.get("/api/admin/register-water-filters", (req, res) => {
  res.render("admin-register-water-filters");
});
publicRouter.get("/bluesense/request-delete-accounts", (req, res) => {
  res.render("request-delete-account");
});
publicRouter.get("/bluesense/playstore", (req, res) => {
  res.render("playstore");
});

publicRouter.post(
  "/api/admin/water-suppliers",
  upload.single("image"),
  adminController.createWaterSupplier
);
publicRouter.post(
  "/api/admin/water-filters",
  upload.single("image"),
  adminController.createWaterFilter
);
publicRouter.get(
  "/api/store/water-suppliers",
  requireAuth,
  adminController.getWaterSupplier
);
publicRouter.get(
  "/api/store/water-filters/:featured?",
  requireAuth,
  adminController.getWaterFilter
);
publicRouter.get(
  "/api/store/water-filters/details/:id",
  requireAuth,
  adminController.getWaterFilterById
);

//UserWaterSupplier
publicRouter.post("/api/water-suppliers", userWaterSupplierController.register);
publicRouter.post(
  "/api/water-suppliers/login",
  userWaterSupplierController.login
);
publicRouter.post(
  "/api/water-suppliers/create",
  upload.single("image"),
  requireAuth,
  userWaterSupplierController.create
);
publicRouter.post(
  "/api/water-suppliers/csv",
  upload.single("csv"),
  requireAuth,
  userWaterSupplierController.insert
);
publicRouter.get(
  "/api/water-suppliers/profile",
  requireAuth,
  userWaterSupplierController.get
);
publicRouter.get(
  "/api/water-suppliers/logs",
  requireAuth,
  userWaterSupplierController.getLogs
);
export { publicRouter };
