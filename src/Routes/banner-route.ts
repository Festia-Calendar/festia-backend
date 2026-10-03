import { Router } from "express";
import * as BannerController from "../Controllers/banner-controller.js";
import {
  authMiddleware,
  allowRoles,
} from "../Middleware/auth-middleware.js";
import { upload } from "../Libs/uploadFile.js";

const bannerRoutes = Router();

/**
 * @swagger
 * tags:
 *   - name: Banner - SuperAdmin
 *     description: API สำหรับจัดการ Banner โดย SuperAdmin
 */

/**
 * @swagger
 * /api/superadmin/banners:
 *   get:
 *     summary: ดึง Banner ทั้งหมด
 *     description: SuperAdmin สามารถดูรายการ Banner ทั้งหมดในระบบ
 *     tags:
 *       - Banner - SuperAdmin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ดึง Banner สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Get banner successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Banner'
 *       400:
 *         description: เกิดข้อผิดพลาด
 */
bannerRoutes.get(
  "/superadmin/banners",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  BannerController.getBanner
);

/**
 * @swagger
 * /api/superadmin/banner/{id}:
 *   get:
 *     summary: ดู Banner ตาม ID
 *     description: SuperAdmin สามารถดูรายละเอียด Banner ตามรหัส
 *     tags:
 *       - Banner - SuperAdmin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: รหัส Banner
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: ดึง Banner สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Get banner successfully
 *                 data:
 *                   $ref: '#/components/schemas/Banner'
 *       400:
 *         description: ไม่พบ Banner
 */
bannerRoutes.get(
  "/superadmin/banner/:id",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  BannerController.getBannerById
);

/**
 * @swagger
 * /api/superadmin/banner:
 *   post:
 *     summary: เพิ่ม Banner
 *     description: SuperAdmin เพิ่ม Banner โดยอัปโหลดรูปภาพ 1 รูป
 *     tags:
 *       - Banner - SuperAdmin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - banner
 *             properties:
 *               banner:
 *                 type: string
 *                 format: binary
 *                 description: รูปภาพ Banner
 *     responses:
 *       200:
 *         description: เพิ่ม Banner สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Create banner successfully
 *                 data:
 *                   $ref: '#/components/schemas/Banner'
 *       400:
 *         description: กรุณาอัปโหลดรูป Banner หรือเกิดข้อผิดพลาด
 */
bannerRoutes.post(
  "/superadmin/banner",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  upload.single("banner"),
  BannerController.createBanner
);

/**
 * @swagger
 * /api/superadmin/banner/{id}:
 *   put:
 *     summary: แก้ไข Banner
 *     description: SuperAdmin แก้ไข Banner โดยอัปโหลดรูปใหม่ 1 รูป
 *     tags:
 *       - Banner - SuperAdmin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: รหัส Banner
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - banner
 *             properties:
 *               banner:
 *                 type: string
 *                 format: binary
 *                 description: รูป Banner ใหม่
 *     responses:
 *       200:
 *         description: แก้ไข Banner สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Update banner successfully
 *                 data:
 *                   $ref: '#/components/schemas/Banner'
 *       400:
 *         description: กรุณาอัปโหลดรูปใหม่หรือไม่พบ Banner
 */
bannerRoutes.put(
  "/superadmin/banner/:id",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  upload.single("banner"),
  BannerController.updateBanner
);

/**
 * @swagger
 * /api/superadmin/banner/{id}:
 *   delete:
 *     summary: ลบ Banner
 *     description: SuperAdmin ลบ Banner ตาม ID
 *     tags:
 *       - Banner - SuperAdmin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: รหัส Banner
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: ลบ Banner สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Delete banner successfully
 *                 data:
 *                   $ref: '#/components/schemas/Banner'
 *       400:
 *         description: ไม่พบ Banner หรือเกิดข้อผิดพลาด
 */
bannerRoutes.delete(
  "/superadmin/banner/:id",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  BannerController.deleteBanner
);

export { bannerRoutes };