import { Router } from "express";
import * as DashboardController from "../Controllers/dashbord-controller.js";
import {
  authMiddleware,
  allowRoles,
} from "../Middleware/auth-middleware.js";

const dashboardRoutes = Router();

/*
 * Dashboard สำหรับ Admin ดู Dashboard ของตนเอง
 */
dashboardRoutes.get(
  "/admin/dashboard",
  authMiddleware,
  allowRoles("ADMIN"),
  DashboardController.getAdminDashboard
);

/*
 * Dashboard สำหรับ Super Admin ดู Dashboard ของระบบ
 */
dashboardRoutes.get(
  "/superadmin/dashboard",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  DashboardController.getSuperAdminDashboard
);

export {
  dashboardRoutes,
};