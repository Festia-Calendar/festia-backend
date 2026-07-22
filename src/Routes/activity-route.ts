import { Router } from "express";
import * as ActivitiyController from "../Controllers/activity-controller.js";

const activityRoutes = Router();

/*
 * คำอธิบาย :Route สำหรับดึงรายการกิจกรรมทั้งหมด
 * Input : ไม่มี
 * Output : รายการกิจกรรมทั้งหมด
*/
activityRoutes.get(
  "/activities",
  ActivitiyController.listActivities
);

export { activityRoutes };