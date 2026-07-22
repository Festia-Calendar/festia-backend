import { Router } from "express";
import * as ActivityController from "../Controllers/activity-controller.js";
import { authMiddleware, allowRoles } from "../Middleware/auth-middleware.js";

const activityRoutes = Router();

/*
 * คำอธิบาย : Route สำหรับ SuperAdmin ดึงรายการกิจกรรมทั้งหมด
*/
activityRoutes.get(
  "/superadmin/activities",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  ActivityController.getActivityBySuperAdmin
);

/*
 * คำอธิบาย : Route สำหรับ Admin ดึงรายการกิจกรรมของตนเอง
*/
activityRoutes.get(
  "/admin/activities",
  authMiddleware,
  allowRoles("ADMIN"),
  ActivityController.getActivityByAdmin
);

/*
 * คำอธิบาย : Route สำหรับ Admin ดูรายละเอียดกิจกรรมตาม ID
*/
activityRoutes.get(
  "/admin/activity/:id",
  authMiddleware,allowRoles("ADMIN"),
  ActivityController.getActivityDetailByAdmin
);

/*
 * คำอธิบาย : Route สำหรับ SuperAdmin ดูรายละเอียดกิจกรรมตาม ID
*/
activityRoutes.get(
  "/superadmin/activity/:id",
  authMiddleware,allowRoles("SUPERADMIN"),
  ActivityController.getActivityDetailBySuperadmin
);

/*
 * คำอธิบาย : Route สำหรับ SuperAdmin สร้างกิจกรรมใหม่
*/
activityRoutes.post(
  "/superadmin/activity",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  ActivityController.createActivityBySuperAdmin
);

/*
 * คำอธิบาย : Route สำหรับ Admin สร้างกิจกรรมใหม่
*/
activityRoutes.post(
  "/admin/activity",
  authMiddleware,
  allowRoles("ADMIN"),
  ActivityController.createActivityByAdmin
);

/*
 * คำอธิบาย : Route สำหรับ SuperAdmin ลบกิจกรรม
*/
activityRoutes.delete(
  "/superadmin/activity/:id",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  ActivityController.deleteActivityBySuperAdmin
);

/*
 * คำอธิบาย : Route สำหรับ Admin ลบกิจกรรมของตัวเอง
*/
activityRoutes.delete(
  "/admin/activity/:id",
  authMiddleware,
  allowRoles("ADMIN"),
  ActivityController.deleteActivityByAdmin
);

export { activityRoutes };