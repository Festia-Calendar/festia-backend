import { Router } from "express";
import * as ActivityController from "../Controllers/activity-controller.js";
import { authMiddleware, allowRoles } from "../Middleware/auth-middleware.js";

const activityRoutes = Router();


activityRoutes.get(
  "/superadmin/activities",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  ActivityController.getActivityBySuperAdmin
);

activityRoutes.get(
  "/admin/activities",
  authMiddleware,
  allowRoles("ADMIN"),
  ActivityController.getActivityByAdmin
);

activityRoutes.get(
  "/admin/activity/:id",
  authMiddleware,allowRoles("ADMIN"),
  ActivityController.getActivityDetailByAdmin
);

activityRoutes.get(
  "/superadmin/activity/:id",
  authMiddleware,allowRoles("SUPERADMIN"),
  ActivityController.getActivityDetailBySuperadmin
);

export { activityRoutes };