import { Router } from "express";
import { expertSlidesHealthMonitor } from "../controllers/healthController.js";

const healthRouter = Router();

healthRouter.get('/summary', expertSlidesHealthMonitor);

export default healthRouter;