import { Router } from "express";
import * as HomeController from "../Controllers/home-controller.js";

const homeRoutes = Router();

/*
 * คำอธิบาย : หน้า Home ดึง Banner และ Activity Type
*/
homeRoutes.get(
  "/home",
  HomeController.getHomeData
);

export { homeRoutes };