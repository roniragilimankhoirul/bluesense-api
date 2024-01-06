import express from "express";
import { publicRouter } from "../route/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.use(publicRouter);
app.use(errorMiddleware);

export { app };
