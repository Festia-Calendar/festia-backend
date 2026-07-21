import { Router } from "express";
import { activityRoutes } from "./activity-route.js"

const rootRouter: Router = Router();
rootRouter.use(activityRoutes);

export default rootRouter;