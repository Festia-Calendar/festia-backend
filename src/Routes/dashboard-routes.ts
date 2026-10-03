import { Router } from "express";
import * as DashboardController from "../Controllers/dashbord-controller.js";
import {
  authMiddleware,
  allowRoles,
} from "../Middleware/auth-middleware.js";

const dashboardRoutes = Router();

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: แสดง Dashboard Activity สำหรับ Admin
 *     description: แสดงข้อมูลสถิติกิจกรรมของ Admin ตามช่วงวันที่ ภาค และจังหวัด
 *     tags:
 *       - Dashboard - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: false
 *         description: วันที่เริ่มต้นสำหรับกรองข้อมูล
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-01-01"
 *
 *       - in: query
 *         name: endDate
 *         required: false
 *         description: วันที่สิ้นสุดสำหรับกรองข้อมูล
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-12-31"
 *
 *       - in: query
 *         name: zone
 *         required: false
 *         description: ภาคที่ต้องการกรองข้อมูล
 *         schema:
 *           type: string
 *           example: "ภาคกลาง"
 *
 *       - in: query
 *         name: province
 *         required: false
 *         description: จังหวัดที่ต้องการกรองข้อมูล
 *         schema:
 *           type: string
 *           example: "กรุงเทพมหานคร"
 *
 *     responses:
 *       200:
 *         description: ดึงข้อมูล Dashboard Admin สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Get admin dashboard successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     filter:
 *                       type: object
 *                       properties:
 *                         startDate:
 *                           type: string
 *                           nullable: true
 *                           example: "2026-01-01"
 *                         endDate:
 *                           type: string
 *                           nullable: true
 *                           example: "2026-12-31"
 *                         zone:
 *                           type: string
 *                           nullable: true
 *                           example: "ภาคกลาง"
 *                         province:
 *                           type: string
 *                           nullable: true
 *                           example: "กรุงเทพมหานคร"
 *                         userId:
 *                           type: integer
 *                           nullable: true
 *                           example: 1
 *
 *                     activityByType:
 *                       type: array
 *                       description: จำนวนกิจกรรมแยกตามประเภท
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             example: "FOOD_DRINK_FESTIVAL"
 *                           count:
 *                             type: integer
 *                             example: 10
 *
 *                     activityByMonth:
 *                       type: array
 *                       description: จำนวนกิจกรรมแยกตามเดือน
 *                       items:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: integer
 *                             example: 1
 *                           count:
 *                             type: integer
 *                             example: 5
 *
 *                     popularActivities:
 *                       type: array
 *                       description: 10 อันดับกิจกรรมที่มีจำนวนการเข้าชมสูงสุด
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "เทศกาลอาหารไทย"
 *                           activityType:
 *                             type: string
 *                             example: "FOOD_DRINK_FESTIVAL"
 *                           viewCount:
 *                             type: integer
 *                             example: 1250
 *                           startDate:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                           location:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 example: "ลานกิจกรรม"
 *                               zone:
 *                                 type: string
 *                                 example: "ภาคกลาง"
 *                               province:
 *                                 type: string
 *                                 example: "กรุงเทพมหานคร"
 *
 *                     activityByProvince:
 *                       type: array
 *                       description: จำนวนกิจกรรมและยอดเข้าชมแยกตามจังหวัด
 *                       items:
 *                         type: object
 *                         properties:
 *                           province:
 *                             type: string
 *                             example: "กรุงเทพมหานคร"
 *                           count:
 *                             type: integer
 *                             example: 15
 *                           viewCount:
 *                             type: integer
 *                             example: 3500
 *
 *       401:
 *         description: ไม่พบข้อมูลผู้ใช้งาน
 *       500:
 *         description: เกิดข้อผิดพลาดภายในระบบ
 */
dashboardRoutes.get(
  "/admin/dashboard",
  authMiddleware,
  allowRoles("ADMIN"),
  DashboardController.getAdminDashboard
);

/**
 * @swagger
 * /api/superadmin/dashboard:
 *   get:
 *     summary: แสดง Dashboard Activity สำหรับ Super Admin
 *     description: แสดงข้อมูลสถิติกิจกรรมทั้งหมดของระบบตามช่วงวันที่ ภาค และจังหวัด
 *     tags:
 *       - Dashboard - SuperAdmin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: false
 *         description: วันที่เริ่มต้นสำหรับกรองข้อมูล
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-01-01"
 *
 *       - in: query
 *         name: endDate
 *         required: false
 *         description: วันที่สิ้นสุดสำหรับกรองข้อมูล
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-12-31"
 *
 *       - in: query
 *         name: zone
 *         required: false
 *         description: ภาคที่ต้องการกรองข้อมูล
 *         schema:
 *           type: string
 *           example: "ภาคกลาง"
 *
 *       - in: query
 *         name: province
 *         required: false
 *         description: จังหวัดที่ต้องการกรองข้อมูล
 *         schema:
 *           type: string
 *           example: "กรุงเทพมหานคร"
 *
 *     responses:
 *       200:
 *         description: ดึงข้อมูล Dashboard Super Admin สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Get super admin dashboard successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     filter:
 *                       type: object
 *                       properties:
 *                         startDate:
 *                           type: string
 *                           nullable: true
 *                           example: "2026-01-01"
 *                         endDate:
 *                           type: string
 *                           nullable: true
 *                           example: "2026-12-31"
 *                         zone:
 *                           type: string
 *                           nullable: true
 *                           example: "ภาคกลาง"
 *                         province:
 *                           type: string
 *                           nullable: true
 *                           example: "กรุงเทพมหานคร"
 *
 *                     activityByType:
 *                       type: array
 *                       description: จำนวนกิจกรรมแยกตามประเภท
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             example: "FOOD_DRINK_FESTIVAL"
 *                           count:
 *                             type: integer
 *                             example: 10
 *
 *                     activityByMonth:
 *                       type: array
 *                       description: จำนวนกิจกรรมแยกตามเดือน
 *                       items:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: integer
 *                             example: 1
 *                           count:
 *                             type: integer
 *                             example: 5
 *
 *                     popularActivities:
 *                       type: array
 *                       description: 10 อันดับกิจกรรมที่มีจำนวนการเข้าชมสูงสุด
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "เทศกาลอาหารไทย"
 *                           activityType:
 *                             type: string
 *                             example: "FOOD_DRINK_FESTIVAL"
 *                           viewCount:
 *                             type: integer
 *                             example: 1250
 *                           startDate:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                           location:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 example: "ลานกิจกรรม"
 *                               zone:
 *                                 type: string
 *                                 example: "ภาคกลาง"
 *                               province:
 *                                 type: string
 *                                 example: "กรุงเทพมหานคร"
 *
 *                     activityByZone:
 *                       type: array
 *                       description: จำนวนกิจกรรมแยกตามภาค
 *                       items:
 *                         type: object
 *                         properties:
 *                           zone:
 *                             type: string
 *                             example: "ภาคกลาง"
 *                           count:
 *                             type: integer
 *                             example: 20
 *
 *                     activityByProvince:
 *                       type: array
 *                       description: จำนวนกิจกรรมและยอดเข้าชมแยกตามจังหวัด
 *                       items:
 *                         type: object
 *                         properties:
 *                           province:
 *                             type: string
 *                             example: "กรุงเทพมหานคร"
 *                           count:
 *                             type: integer
 *                             example: 15
 *                           viewCount:
 *                             type: integer
 *                             example: 3500
 *
 *       401:
 *         description: ไม่พบข้อมูลผู้ใช้งาน
 *       500:
 *         description: เกิดข้อผิดพลาดภายในระบบ
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