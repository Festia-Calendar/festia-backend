import { Router } from "express";
import * as ActivityController from "../Controllers/activity-controller.js";
import { authMiddleware, allowRoles } from "../Middleware/auth-middleware.js";

const activityRoutes = Router();

/*
 * คำอธิบาย : SuperAdmin ดูรายการกิจกรรมรออนุมัติ
 */
activityRoutes.get(
  "/superadmin/activity-requests",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  ActivityController.getRequestActivitiesForSuperAdmin
);

/*
 * คำอธิบาย : SuperAdmin ดูรายละเอียดกิจกรรมรออนุมัติ
 */
activityRoutes.get(
  "/superadmin/activity-requests/:id",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  ActivityController.getRequestActivityDetailForSuperAdmin
);

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


/*
 * คำอธิบาย : Route สำหรับ Admin แก้กิจกรรมตัวเอง
*/
activityRoutes.put(
  "/admin/activity/:id",
  authMiddleware,
  allowRoles("ADMIN"),
  ActivityController.updateActivityByAdmin
);

/*
 * คำอธิบาย : Route สำหรับ SuperAdmin แก้กิจกรรมทั้งหมด
*/
activityRoutes.put(
  "/superadmin/activity/:id",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  ActivityController.updateActivityBySuperAdmin
);

/*
 * คำอธิบาย : SuperAdmin อนุมัติกิจกรรม
 */
activityRoutes.patch(
  "/superadmin/activity-requests/:id/approve",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  ActivityController.approveActivityBySuperAdmin
);

/*
 * คำอธิบาย : SuperAdmin ปฏิเสธกิจกรรม
 */
activityRoutes.patch(
  "/superadmin/activity-requests/:id/reject",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  ActivityController.rejectActivityBySuperAdmin
);

/*
 * คำอธิบาย : หน้า Home ดูรายละเอียดกิจกรรม
 */
activityRoutes.get(
  "/home/activity/:id",
  ActivityController.getActivityDetailForHome
);

/*
 * คำอธิบาย : หน้า Home ดึงกิจกรรมเดือนปัจจุบัน
 */
activityRoutes.get(
  "/home/activities",
  ActivityController.getHomeActivity
);

export { activityRoutes };