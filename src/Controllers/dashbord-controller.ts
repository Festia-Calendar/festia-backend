/*
 * คำอธิบาย :
 * Controller สำหรับจัดการข้อมูล Dashboard Activity
 *
 * Input :
 * - year : ปีที่ต้องการดูข้อมูล
 * - month : เดือนที่ต้องการดูข้อมูล
 * - zone : ภาคที่ต้องการกรองข้อมูล
 * - province : จังหวัดที่ต้องการกรองข้อมูล
 *
 * Output :
 * ข้อมูล Dashboard Activity สำหรับ Admin และ Super Admin
 */

import type { Request, Response } from "express";
import * as DashboardService from "../Services/Dashbord/dashboard-service.js";
import {
  createErrorResponse,
  createResponse,
} from "../Libs/createResponse.js";
import type { DashboardActivityQueryDto } from "../Services/Dashbord/dashboard-dto.js";

/*
 * คำอธิบาย :
 * ดึงข้อมูล Dashboard Activity สำหรับ Admin
 *
 * Input :
 * - year : ปีที่ต้องการดูข้อมูล
 * - month : เดือนที่ต้องการดูข้อมูล
 *
 * Output :
 * object ประกอบด้วย
 * - จำนวนกิจกรรมแยกตามประเภท
 * - จำนวนกิจกรรมแยกตามเดือน
 * - 10 อันดับกิจกรรมที่มี viewCount สูงสุด
 */
export async function getAdminDashboard(
  req: Request,
  res: Response
) {
  try {
    const query = req.query;

    const startDate = typeof query.startDate === "string" ? query.startDate.trim() : undefined;
    const endDate = typeof query.endDate === "string" ? query.endDate.trim() : undefined;
    const zone = typeof query.zone === "string" ? query.zone.trim() : undefined;
    const province = typeof query.province === "string" ? query.province.trim() : undefined;

    if (zone === "") {
      return createErrorResponse(res, 400, "Invalid zone");
    }

    if (province === "") {
      return createErrorResponse(res, 400, "Invalid province");
    }

    const currentUserId = (req as any).user?.id || (req as any).userId; 

    if (!currentUserId) {
        return createErrorResponse(res, 401, "Unauthorized: ไม่พบข้อมูลผู้ใช้งาน");
    }

    const dashboardQuery: DashboardActivityQueryDto = {
      startDate,
      endDate,
      zone,
      province,
      userId: Number(currentUserId),
    };

    const result = await DashboardService.getAdminDashboard(dashboardQuery);

    return createResponse(
      res,
      200,
      "Get admin dashboard successfully",
      result
    );
  } catch (error) {
    console.error("getAdminDashboard error:", error);

    return createErrorResponse(
      res,
      500,
      "Internal server error"
    );
  }
}

/*
 * คำอธิบาย :
 * ดึงข้อมูล Dashboard Activity สำหรับ Super Admin
 *
 * Input :
 * - year : ปีที่ต้องการดูข้อมูล
 * - month : เดือนที่ต้องการดูข้อมูล
 * - zone : ภาคที่ต้องการกรองข้อมูล
 * - province : จังหวัดที่ต้องการกรองข้อมูล
 *
 * Output :
 * object ประกอบด้วย
 * - จำนวนกิจกรรมแยกตามประเภท
 * - จำนวนกิจกรรมแยกตามเดือน
 * - 10 อันดับกิจกรรมที่มี viewCount สูงสุด
 * - จำนวนกิจกรรมแยกตามภาค
 * - จำนวนกิจกรรมแยกตามจังหวัด
 */
/*
 * คำอธิบาย :
 * ดึงข้อมูล Dashboard Activity สำหรับ Super Admin
 */
export async function getSuperAdminDashboard(
  req: Request,
  res: Response
) {
  try {
    const query = req.query;

    const startDate = typeof query.startDate === "string" ? query.startDate.trim() : undefined;
    const endDate = typeof query.endDate === "string" ? query.endDate.trim() : undefined;
    const zone = typeof query.zone === "string" ? query.zone.trim() : undefined;
    const province = typeof query.province === "string" ? query.province.trim() : undefined;

    if (zone === "") {
      return createErrorResponse(res, 400, "Invalid zone");
    }

    if (province === "") {
      return createErrorResponse(res, 400, "Invalid province");
    }

    const dashboardQuery: DashboardActivityQueryDto = {
      startDate,
      endDate,
      zone,
      province,
    };

    const result = await DashboardService.getSuperAdminDashboard(dashboardQuery);

    return createResponse(
      res,
      200,
      "Get super admin dashboard successfully",
      result
    );
  } catch (error) {
    console.error("getSuperAdminDashboard error:", error);
    return createErrorResponse(res, 500, "Internal server error");
  }
}