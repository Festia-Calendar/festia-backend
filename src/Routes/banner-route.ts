import { Router } from "express";
import * as BannerController from "../Controllers/banner-controller.js";
import {
  authMiddleware,
  allowRoles
} from "../Middleware/auth-middleware.js";
import { upload } from "../Libs/uploadFile.js";

const bannerRoutes = Router();

/*
 * คำอธิบาย : SuperAdmin ดู Banner ทั้งหมด
 */
bannerRoutes.get(
  "/superadmin/banners",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  BannerController.getBanner
);

/*
 * คำอธิบาย : SuperAdmin ดู Banner ตาม ID
 */
bannerRoutes.get(
  "/superadmin/banner/:id",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  BannerController.getBannerById
);

/*
 * คำอธิบาย : SuperAdmin เพิ่ม Banner
 * รับรูป 1 รูป
 */
bannerRoutes.post(
  "/superadmin/banner",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  upload.single("banner"),
  BannerController.createBanner
);

/*
 * คำอธิบาย : SuperAdmin แก้ไข Banner
 */
bannerRoutes.put(
  "/superadmin/banner/:id",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  upload.single("banner"),
  BannerController.updateBanner
);

/*
 * คำอธิบาย : SuperAdmin ลบ Banner
 */
bannerRoutes.delete(
  "/superadmin/banner/:id",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  BannerController.deleteBanner
);

export {
  bannerRoutes
};