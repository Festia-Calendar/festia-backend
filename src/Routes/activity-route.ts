import { Router } from "express";
import * as ActivityController from "../Controllers/activity-controller.js";
import { authMiddleware, allowRoles } from "../Middleware/auth-middleware.js";
import { upload } from "../Libs/uploadFile.js";
import { compressUploaded } from "../Middleware/upload-middleware.js";

const activityRoutes = Router();

/**
 * @swagger
 * tags:
 *   - name: Activity - SuperAdmin
 *     description: API สำหรับจัดการกิจกรรมโดย SuperAdmin
 *   - name: Activity - Admin
 *     description: API สำหรับจัดการกิจกรรมโดย Admin
 *   - name: Activity - Home
 *     description: API สำหรับแสดงกิจกรรมสำหรับผู้ใช้งานทั่วไป
 */

/**
 * @swagger
 * /api/superadmin/activity/histories:
 *   get:
 *     summary: ดึงประวัติกิจกรรมทั้งหมด
 *     description: SuperAdmin ดึงประวัติกิจกรรมที่สิ้นสุดแล้วทั้งหมด
 *     tags:
 *       - Activity - SuperAdmin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: หมายเลขหน้า
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: จำนวนรายการต่อหน้า
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: festival
 *         description: คำค้นหา
 *     responses:
 *       200:
 *         description: ดึงประวัติกิจกรรมสำเร็จ
 *       400:
 *         description: เกิดข้อผิดพลาด
 */
activityRoutes.get(
  "/superadmin/activity/histories",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  ActivityController.getActivityHistoryBySuperAdmin
);

/**
 * @swagger
 * /api/admin/activity/histories:
 *   get:
 *     summary: ดึงประวัติกิจกรรมของ Admin
 *     description: Admin ดึงประวัติกิจกรรมที่สิ้นสุดแล้วของตนเอง
 *     tags:
 *       - Activity - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: festival
 *     responses:
 *       200:
 *         description: ดึงประวัติกิจกรรมสำเร็จ
 *       400:
 *         description: เกิดข้อผิดพลาด
 */
activityRoutes.get(
  "/admin/activity/histories",
  authMiddleware,
  allowRoles("ADMIN"),
  ActivityController.getActivityHistoryByAdmin
);

/**
 * @swagger
 * /api/admin/activity/draft:
 *   get:
 *     summary: ดึงกิจกรรม Draft
 *     description: Admin ดึงรายการกิจกรรม Draft ของตนเอง
 *     tags:
 *       - Activity - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ดึงกิจกรรม Draft สำเร็จ
 *       400:
 *         description: เกิดข้อผิดพลาด
 */
activityRoutes.get(
  "/admin/activity/draft",
  authMiddleware,
  allowRoles("ADMIN"),
  ActivityController.getDraftActivityByAdmin
);

/**
 * @swagger
 * /api/admin/activity/draft/{id}:
 *   delete:
 *     summary: ลบกิจกรรม Draft
 *     description: Admin ลบกิจกรรม Draft ของตนเอง
 *     tags:
 *       - Activity - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: รหัสกิจกรรม
 *     responses:
 *       200:
 *         description: ลบกิจกรรม Draft สำเร็จ
 *       400:
 *         description: ไม่พบกิจกรรมหรือเกิดข้อผิดพลาด
 */
activityRoutes.delete(
  "/admin/activity/draft/:id",
  authMiddleware,
  allowRoles("ADMIN"),
  ActivityController.deleteDraftActivityByAdmin
);

/**
 * @swagger
 * /api/superadmin/activity-requests:
 *   get:
 *     summary: ดึงรายการกิจกรรมรออนุมัติ
 *     description: SuperAdmin ดึงรายการกิจกรรมที่มีสถานะรออนุมัติ
 *     tags:
 *       - Activity - SuperAdmin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: festival
 *     responses:
 *       200:
 *         description: ดึงรายการกิจกรรมรออนุมัติสำเร็จ
 *       400:
 *         description: เกิดข้อผิดพลาด
 */
activityRoutes.get(
  "/superadmin/activity-requests",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  ActivityController.getRequestsActivitiesForSuperAdmin
);

/**
 * @swagger
 * /api/superadmin/activity-requests/{id}:
 *   get:
 *     summary: ดูรายละเอียดกิจกรรมรออนุมัติ
 *     description: SuperAdmin ดูรายละเอียดกิจกรรมที่รออนุมัติ
 *     tags:
 *       - Activity - SuperAdmin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: ดึงรายละเอียดกิจกรรมสำเร็จ
 *       400:
 *         description: ไม่พบกิจกรรม
 */
activityRoutes.get(
  "/superadmin/activity-requests/:id",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  ActivityController.getRequestsActivityDetailForSuperAdmin
);

/**
 * @swagger
 * /api/superadmin/activities:
 *   get:
 *     summary: ดึงรายการกิจกรรมทั้งหมด
 *     description: SuperAdmin ดึงรายการกิจกรรมทั้งหมด พร้อม Pagination และ Search
 *     tags:
 *       - Activity - SuperAdmin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: งานเทศกาล
 *       - in: query
 *         name: activityType
 *         schema:
 *           type: string
 *           enum:
 *             - CULTURAL_FESTIVAL
 *             - EXHIBITION_ART
 *             - PERFORMANCE_MUSIC
 *             - FOOD_DRINK_FESTIVAL
 *             - MARKET_FAIR
 *             - TRAINING_SEMINAR
 *             - SPORT_RECREATION
 *             - COMMUNITY_TOURISM
 *       - in: query
 *         name: zone
 *         schema:
 *           type: string
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *       - in: query
 *         name: subDistrict
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-10-01"
 *       - in: query
 *         name: dueDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-10-31"
 *     responses:
 *       200:
 *         description: ดึงรายการกิจกรรมสำเร็จ
 *       400:
 *         description: เกิดข้อผิดพลาด
 */
activityRoutes.get(
  "/superadmin/activities",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  ActivityController.getActivityBySuperAdmin
);

/**
 * @swagger
 * /api/admin/activities:
 *   get:
 *     summary: ดึงรายการกิจกรรมของ Admin
 *     description: Admin ดึงรายการกิจกรรมของตนเอง
 *     tags:
 *       - Activity - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: งานเทศกาล
 *       - in: query
 *         name: activityType
 *         schema:
 *           type: string
 *       - in: query
 *         name: zone
 *         schema:
 *           type: string
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *       - in: query
 *         name: subDistrict
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dueDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: ดึงรายการกิจกรรมสำเร็จ
 *       400:
 *         description: เกิดข้อผิดพลาด
 */
activityRoutes.get(
  "/admin/activities",
  authMiddleware,
  allowRoles("ADMIN"),
  ActivityController.getActivityByAdmin
);

/**
 * @swagger
 * /api/admin/activity/{id}:
 *   get:
 *     summary: ดูรายละเอียดกิจกรรมของ Admin
 *     tags:
 *       - Activity - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: ดึงรายละเอียดกิจกรรมสำเร็จ
 *       400:
 *         description: ไม่พบกิจกรรม
 */
activityRoutes.get(
  "/admin/activity/:id",
  authMiddleware,
  allowRoles("ADMIN"),
  ActivityController.getActivityDetailByAdmin
);

/**
 * @swagger
 * /api/superadmin/activity/{id}:
 *   get:
 *     summary: ดูรายละเอียดกิจกรรม
 *     tags:
 *       - Activity - SuperAdmin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: ดึงรายละเอียดกิจกรรมสำเร็จ
 *       400:
 *         description: ไม่พบกิจกรรม
 */
activityRoutes.get(
  "/superadmin/activity/:id",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  ActivityController.getActivityDetailBySuperadmin
);

/**
 * @swagger
 * /api/superadmin/activity:
 *   post:
 *     summary: สร้างกิจกรรมโดย SuperAdmin
 *     description: |
 *       สร้างกิจกรรมใหม่ โดยส่งข้อมูล Activity ผ่าน field `activity`
 *       เป็น JSON String และส่งไฟล์ผ่าน multipart/form-data
 *     tags:
 *       - Activity - SuperAdmin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - activity
 *             properties:
 *               activity:
 *                 type: string
 *                 description: JSON String ของข้อมูล Activity
 *                 example: '{"location":{"name":"ศูนย์ประชุม","zone":"ภาคกลาง","province":"กรุงเทพมหานคร","district":"ปทุมวัน","subDistrict":"ลุมพินี","detail":"รายละเอียดสถานที่","latitude":13.7466,"longitude":100.5393},"name":"งานเทศกาลตัวอย่าง","tagline":"เทศกาลประจำปี","description":"รายละเอียดกิจกรรม","activityType":"CULTURAL_FESTIVAL","phone":"0812345678","lineUrl":"https://line.me/example","facebookUrl":"https://facebook.com/example","price":100,"statusActivity":"DRAFT","startDate":"2026-10-01","dueDate":"2026-10-03","schedules":[{"title":"พิธีเปิด","description":"พิธีเปิดงาน","startDateTime":"2026-10-01T09:00:00","endDateTime":"2026-10-01T10:00:00","fileIndexes":[0]}]}'
 *               cover:
 *                 type: string
 *                 format: binary
 *                 description: รูปภาพ Cover
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: รูปภาพ/วิดีโอ สูงสุด 4 ไฟล์
 *               scheduleFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: ไฟล์ประกอบ Schedule
 *     responses:
 *       201:
 *         description: สร้างกิจกรรมสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 */
activityRoutes.post(
  "/superadmin/activity",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  upload.fields([
    {
      name: "cover",
      maxCount: 1,
    },
    {
      name: "media",
      maxCount: 4,
    },
    {
      name: "scheduleFiles",
      maxCount: 999,
    },
  ]),
  compressUploaded,
  ActivityController.createActivityBySuperAdmin
);

/**
 * @swagger
 * /api/admin/activity:
 *   post:
 *     summary: สร้างกิจกรรมโดย Admin
 *     description: สร้างกิจกรรมใหม่ โดยกิจกรรมที่สร้างโดย Admin จะเข้าสู่สถานะรออนุมัติ
 *     tags:
 *       - Activity - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - activity
 *             properties:
 *               activity:
 *                 type: string
 *                 description: JSON String ของข้อมูล Activity
 *                 example: '{"location":{"name":"ศูนย์ประชุม","zone":"ภาคกลาง","province":"กรุงเทพมหานคร","district":"ปทุมวัน","subDistrict":"ลุมพินี","detail":"รายละเอียดสถานที่","latitude":13.7466,"longitude":100.5393},"name":"งานเทศกาลตัวอย่าง","tagline":"เทศกาลประจำปี","description":"รายละเอียดกิจกรรม","activityType":"CULTURAL_FESTIVAL","phone":"0812345678","lineUrl":"https://line.me/example","facebookUrl":"https://facebook.com/example","price":100,"statusActivity":"DRAFT","startDate":"2026-10-01","dueDate":"2026-10-03","schedules":[{"title":"พิธีเปิด","description":"พิธีเปิดงาน","startDateTime":"2026-10-01T09:00:00","endDateTime":"2026-10-01T10:00:00","fileIndexes":[0]}]}'
 *               cover:
 *                 type: string
 *                 format: binary
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               scheduleFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: สร้างกิจกรรมสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 */
activityRoutes.post(
  "/admin/activity",
  authMiddleware,
  allowRoles("ADMIN"),
  upload.fields([
    {
      name: "cover",
      maxCount: 1,
    },
    {
      name: "media",
      maxCount: 4,
    },
    {
      name: "scheduleFiles",
      maxCount: 999,
    },
  ]),
  compressUploaded,
  ActivityController.createActivityByAdmin
);

/**
 * @swagger
 * /api/superadmin/activity/{id}:
 *   delete:
 *     summary: ลบกิจกรรมโดย SuperAdmin
 *     tags:
 *       - Activity - SuperAdmin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: ลบกิจกรรมสำเร็จ
 *       400:
 *         description: เกิดข้อผิดพลาด
 */
activityRoutes.delete(
  "/superadmin/activity/:id",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  ActivityController.deleteActivityBySuperAdmin
);

/**
 * @swagger
 * /api/admin/activity/{id}:
 *   delete:
 *     summary: ลบกิจกรรมโดย Admin
 *     tags:
 *       - Activity - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: ลบกิจกรรมสำเร็จ
 *       400:
 *         description: เกิดข้อผิดพลาด
 */
activityRoutes.delete(
  "/admin/activity/:id",
  authMiddleware,
  allowRoles("ADMIN"),
  ActivityController.deleteActivityByAdmin
);

/**
 * @swagger
 * /api/admin/activity/{id}:
 *   put:
 *     summary: แก้ไขกิจกรรมโดย Admin
 *     description: แก้ไขกิจกรรมของตนเอง พร้อมเพิ่ม/ลบไฟล์และ Schedule
 *     tags:
 *       - Activity - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
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
 *               - activity
 *             properties:
 *               activity:
 *                 type: string
 *                 description: JSON String ของข้อมูลที่ต้องการแก้ไข
 *                 example: '{"name":"ชื่อกิจกรรมใหม่","description":"รายละเอียดใหม่","statusActivity":"PUBLISH","mediaDeleteIds":[1,2],"scheduleDeleteIds":[3],"schedules":[{"id":4,"title":"กำหนดการใหม่","startDateTime":"2026-10-01T09:00:00","endDateTime":"2026-10-01T10:00:00","fileIndexes":[0],"deleteFileIds":[5]}]}'
 *               cover:
 *                 type: string
 *                 format: binary
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               scheduleFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: แก้ไขกิจกรรมสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 */
activityRoutes.put(
  "/admin/activity/:id",
  authMiddleware,
  allowRoles("admin"),
  upload.fields([
    {
      name: "cover",
      maxCount: 1,
    },
    {
      name: "media",
      maxCount: 4,
    },
    {
      name: "scheduleFiles",
      maxCount: 999,
    },
  ]),
  compressUploaded,
  ActivityController.updateActivityByAdmin
);

/**
 * @swagger
 * /api/superadmin/activity/{id}:
 *   put:
 *     summary: แก้ไขกิจกรรมโดย SuperAdmin
 *     description: แก้ไขกิจกรรม พร้อมเพิ่ม/ลบไฟล์และ Schedule
 *     tags:
 *       - Activity - SuperAdmin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
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
 *               - activity
 *             properties:
 *               activity:
 *                 type: string
 *                 description: JSON String ของข้อมูลที่ต้องการแก้ไข
 *                 example: '{"name":"ชื่อกิจกรรมใหม่","description":"รายละเอียดใหม่","statusActivity":"PUBLISH","mediaDeleteIds":[1,2],"scheduleDeleteIds":[3],"schedules":[{"id":4,"title":"กำหนดการใหม่","startDateTime":"2026-10-01T09:00:00","endDateTime":"2026-10-01T10:00:00","fileIndexes":[0]}]}'
 *               cover:
 *                 type: string
 *                 format: binary
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               scheduleFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: แก้ไขกิจกรรมสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 */
activityRoutes.put(
  "/superadmin/activity/:id",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  upload.fields([
    {
      name: "cover",
      maxCount: 1,
    },
    {
      name: "media",
      maxCount: 4,
    },
    {
      name: "scheduleFiles",
      maxCount: 999,
    },
  ]),
  compressUploaded,
  ActivityController.updateActivityBySuperAdmin
);

/**
 * @swagger
 * /api/superadmin/activity-requests/{id}/approve:
 *   patch:
 *     summary: อนุมัติกิจกรรม
 *     description: SuperAdmin อนุมัติกิจกรรมที่รออนุมัติ
 *     tags:
 *       - Activity - SuperAdmin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: อนุมัติกิจกรรมสำเร็จ
 *       400:
 *         description: ไม่พบกิจกรรมหรือกิจกรรมถูกดำเนินการไปแล้ว
 */
activityRoutes.patch(
  "/superadmin/activity-requests/:id/approve",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  ActivityController.approveActivityBySuperAdmin
);

/**
 * @swagger
 * /api/superadmin/activity-requests/{id}/reject:
 *   patch:
 *     summary: ปฏิเสธกิจกรรม
 *     description: SuperAdmin ปฏิเสธกิจกรรมพร้อมระบุเหตุผล
 *     tags:
 *       - Activity - SuperAdmin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 maxLength: 100
 *                 example: ข้อมูลกิจกรรมไม่ครบถ้วน
 *     responses:
 *       200:
 *         description: ปฏิเสธกิจกรรมสำเร็จ
 *       400:
 *         description: ไม่พบกิจกรรมหรือกิจกรรมถูกดำเนินการไปแล้ว
 */
activityRoutes.patch(
  "/superadmin/activity-requests/:id/reject",
  authMiddleware,
  allowRoles("SUPERADMIN"),
  ActivityController.rejectActivityBySuperAdmin
);

/**
 * @swagger
 * /api/home/activity/{id}:
 *   get:
 *     summary: ดูรายละเอียดกิจกรรม
 *     description: ผู้ใช้งานทั่วไปสามารถดูรายละเอียดกิจกรรม
 *     tags:
 *       - Activity - Home
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: ดึงรายละเอียดกิจกรรมสำเร็จ
 *       400:
 *         description: ไม่พบกิจกรรม
 */
activityRoutes.get(
  "/home/activity/:id",
  ActivityController.getActivityDetailForHome
);

/**
 * @swagger
 * /api/home/activities:
 *   get:
 *     summary: ดึงกิจกรรมสำหรับหน้า Home
 *     description: ดึงรายการกิจกรรมสำหรับหน้า Home ตามเดือนปัจจุบัน
 *     tags:
 *       - Activity - Home
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: งานเทศกาล
 *     responses:
 *       200:
 *         description: ดึงรายการกิจกรรมสำเร็จ
 *       400:
 *         description: เกิดข้อผิดพลาด
 */
activityRoutes.get(
  "/home/activities",
  ActivityController.getHomeActivity
);

export { activityRoutes };