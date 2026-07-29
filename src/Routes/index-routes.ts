import { Router } from "express";
import { activityRoutes } from "./activity-route.js"
import { authRoutes } from "./auth-route.js";
import { homeRoutes } from "./home-route.js";
import { bannerRoutes } from "./banner-route.js";


const rootRouter: Router = Router();

rootRouter.use(activityRoutes);
rootRouter.use("/auth",authRoutes);
rootRouter.use(homeRoutes);
rootRouter.use(bannerRoutes);

export default rootRouter;