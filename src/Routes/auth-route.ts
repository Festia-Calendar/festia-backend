import { Router } from "express";
import * as AuthController from "../Controllers/auth-controller.js";
import { authMiddleware, allowRoles } from "../Middleware/auth-middleware.js";

const authRoutes = Router();

/*
 * คำอธิบาย : Route สำหรับเข้าสู่ระบบ
 * Input : "username": "admin", "password": "123456"
 * Output : ข้อมูลผู้ใช้งานและ JWT Token พร้อม Cookie accessToken
 */
authRoutes.post(
  "/login",
  AuthController.login
);

/*
 * คำอธิบาย : Route สำหรับออกจากระบบ
 */
authRoutes.post(
  "/logout",
  authMiddleware,
  AuthController.logout
);

export { authRoutes };