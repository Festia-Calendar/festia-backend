/*
 * คำอธิบาย : Handler สำหรับดึงรายการกิจกรรมทั้งหมด
 * Input: req.query.{page, limit, status}
 * Output:
 * 200 - ข้อมูลกิจกรรมทั้งหมดพร้อม Pagination
 * 400 - Error message
*/

import type { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import {
  createResponse,
  createErrorResponse,
} from "../Libs/createResponse.js";
import { PaginationDto } from "../Services/pagination-dto.js";

import * as ActivityService from "../Services/Activity/activity-service.js";
import {
  ActivityDto,
  UpdateActivityDto,
  ActivityIdParamDto,
  ActivityQueryDto,
  ActivityRejectDto,
  ActivityRequestQueryDto,
} from "../Services/Activity/activity-dto.js";

/**
 * คำอธิบาย : (SuperAdmin) Handler สำหรับดึงรายการ Activity
 * รองรับ Pagination และ Search
 *
 * Input:
 * - req.query.page   - หมายเลขหน้าที่ต้องการ
 * - req.query.search - คำค้นหา
 *
 * Search รองรับ:
 * - ชื่อกิจกรรม
 * - ประเภทกิจกรรม
 * - ภูมิภาค
 * - จังหวัด
 * - อำเภอ
 * - ตำบล
 * - วันที่เริ่มกิจกรรม
 * - วันที่สิ้นสุดกิจกรรม
 *
 * Output:
 * - 200 - ข้อมูล Activity พร้อม Pagination
 * - 400 - Error message
 */
export async function getActivityBySuperAdmin(
  req: Request,
  res: Response
) {
  try {
    const query: PaginationDto =
      req.query as unknown as PaginationDto;
    const result =
      await ActivityService.getActivityBySuperAdmin(query);
    return createResponse(
      res,
      200,
      "Get Activities Success",
      result
    );
  } catch (error) {
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
}

/**
 * คำอธิบาย : (Admin) Handler สำหรับดึงรายการ Activity
 * รองรับ Pagination และ Search
 *
 * Input:
 * - req.user.id  : ID ของ Admin ที่ Login
 * - req.query    : Pagination และ Search
 *
 * Output:
 * - 200 - รายการ Activity พร้อม Pagination
 * - 400 - Error message
 */
export async function getActivityByAdmin(
  req: Request,
  res: Response
) {
  try {
    const userId = Number((req as any).user?.id);
    const query: PaginationDto =
      req.query as unknown as PaginationDto;
    const result = await ActivityService.getActivityByAdmin(
      userId,
      query
    );
    return createResponse(
      res,
      200,
      "Get Activities Success",
      result
    );
  } catch (error) {
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
}

export const getActivityDetailBySuperadmin = async (
  req: Request,
  res: Response
) => {
  try {
    const activity =
      await ActivityService.getActivityDetailBySuperadmin(
        Number(req.params.id)
      );
    return createResponse(
      res,
      200,
      "Get activity detail successfully",
      activity
    );
  } catch (error) {

    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
};

export const getActivityDetailByAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const activity =
      await ActivityService.getActivityDetailByAdmin(
        Number(req.params.id),
        req.user.id
      );
    return createResponse(
      res,
      200,
      "Get activity detail successfully",
      activity
    );
  } catch (error) {
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
};

/**
 * คำอธิบาย : (SuperAdmin) Handler สำหรับสร้างกิจกรรมใหม่
 *
 * Input:
 * - req.body.activity : ข้อมูลกิจกรรมในรูปแบบ JSON String
 * - req.files         : ไฟล์รูปภาพและไฟล์กำหนดการ
 * - req.user.id       : ID ของ SuperAdmin ผู้สร้างกิจกรรม
 *
 * การตรวจสอบ:
 * - ตรวจสอบข้อมูลด้วย ActivityDto
 * - ตรวจสอบ Location ด้วย LocationDto
 * - ตรวจสอบ Schedule ด้วย ActivityScheduleDto
 *
 * Output:
 * - 201 - สร้างกิจกรรมสำเร็จ
 * - 400 - ข้อมูลไม่ถูกต้อง
 */
export async function createActivityBySuperAdmin(
  req: Request,
  res: Response
) {
  try {
    const activityData = JSON.parse(req.body.activity);
    const activityDto = plainToInstance(
      ActivityDto,
      activityData
    );
    const errors = await validate(activityDto);
    if (errors.length > 0) {
      return createErrorResponse(
        res,
        400,
        errors
          .flatMap((error) =>
            Object.values(error.constraints ?? {})
          )
          .join(", ")
      );
    }
    const files = req.files as Record<
      string,
      Express.Multer.File[]
    >;
    const activity =
      await ActivityService.createActivityBySuperAdmin(
        activityDto,
        files,
        req.user.id
      );
    return createResponse(
      res,
      201,
      "สร้างกิจกรรมสำเร็จ",
      activity
    );
  } catch (error) {
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
}

/**
 * คำอธิบาย : (Admin) Handler สำหรับสร้างกิจกรรมใหม่
 *
 * Input:
 * - req.body.activity : ข้อมูลกิจกรรมในรูปแบบ JSON String
 * - req.files         : ไฟล์รูปภาพและไฟล์กำหนดการ
 * - req.user.id       : ID ของ Admin ผู้สร้างกิจกรรม
 *
 * การตรวจสอบ:
 * - ตรวจสอบข้อมูลด้วย ActivityDto
 * - ตรวจสอบ Location ด้วย LocationDto
 * - ตรวจสอบ Schedule ด้วย ActivityScheduleDto
 *
 * Output:
 * - 201 - สร้างกิจกรรมสำเร็จ
 * - 400 - ข้อมูลไม่ถูกต้อง
 */
export async function createActivityByAdmin(
  req: Request,
  res: Response
) {
  try {
    const activityData = JSON.parse(req.body.activity);
    const activityDto = plainToInstance(
      ActivityDto,
      activityData
    );
    const errors = await validate(activityDto);
    if (errors.length > 0) {
      return createErrorResponse(
        res,
        400,
        errors
          .flatMap((error) =>
            Object.values(error.constraints ?? {})
          )
          .join(", ")
      );
    }
    const files = req.files as Record<
      string,
      Express.Multer.File[]
    >;
    const activity =
      await ActivityService.createActivityByAdmin(
        activityDto,
        files,
        req.user.id
      );
    return createResponse(
      res,
      201,
      "สร้างกิจกรรมสำเร็จ",
      activity
    );
  } catch (error) {
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
}

/*
 * คำอธิบาย : ลบกิจกรรมโดย SuperAdmin
 * Input : params.id - รหัสกิจกรรม
 * Output : กิจกรรมถูกลบสำเร็จ
*/
export const deleteActivityBySuperAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const activity =
      await ActivityService.deleteActivityBySuperAdmin(
        Number(req.params.id)
      );
    return createResponse(
      res,
      200,
      "Delete activity successfully",
      activity
    );
  } catch (error) {
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
};

/*
 * คำอธิบาย : ลบกิจกรรมโดย Admin
 * Input : params.id - รหัสกิจกรรม
 * Output : กิจกรรมถูกลบสำเร็จ
 */
export const deleteActivityByAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const activity =
      await ActivityService.deleteActivityByAdmin(
        Number(req.params.id),
        req.user.id
      );
    return createResponse(
      res,
      200,
      "Delete activity successfully",
      activity
    );
  } catch (error) {
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
};

/**
 * คำอธิบาย : SuperAdmin แก้ไขข้อมูลกิจกรรม
 * Input : req.params.id - รหัสกิจกรรม,
 *         req.body.activity - ข้อมูลกิจกรรม,
 *         req.files - ไฟล์ที่อัปโหลด,
 *         req.user.id - รหัสผู้แก้ไข
 * Output : 200 - ข้อมูลกิจกรรมที่แก้ไขสำเร็จ
 *          400 - Error message
 */
export async function updateActivityBySuperAdmin(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params as unknown as ActivityIdParamDto;
    const activityData = JSON.parse(req.body.activity);
    const files = req.files as Record<
      string,
      Express.Multer.File[]
    >;
    const result =
      await ActivityService.updateActivityBySuperAdmin(
        Number(id),
        activityData,
        files,
        req.user.id
      );

    return createResponse(
      res,
      200,
      "Update Activity Success",
      result
    );
  } catch (error) {
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
}

/**
 * คำอธิบาย : (Admin) Handler สำหรับแก้ไขกิจกรรมของตนเอง
 *
 * Input:
 * - req.params.id       : ID ของกิจกรรม
 * - req.body.activity   : ข้อมูลกิจกรรมในรูปแบบ JSON String
 * - req.files           : ไฟล์รูปภาพและไฟล์กำหนดการ
 * - req.user.id         : ID ของ Admin ผู้แก้ไข
 *
 * การตรวจสอบ:
 * - ตรวจสอบ Activity ID ด้วย ActivityIdParamDto
 * - ตรวจสอบข้อมูลกิจกรรมด้วย UpdateActivityDto
 *
 * Output:
 * - 200 - แก้ไขกิจกรรมสำเร็จ
 * - 400 - ข้อมูลไม่ถูกต้อง
 */
export async function updateActivityByAdmin(
  req: Request,
  res: Response
) {
  try {
    const idDto = plainToInstance(
      ActivityIdParamDto,
      req.params
    );
    const idErrors = await validate(idDto);
    if (idErrors.length > 0) {
      return createErrorResponse(
        res,
        400,
        idErrors
          .flatMap((error) =>
            Object.values(error.constraints ?? {})
          )
          .join(", ")
      );
    }
    const activityData = JSON.parse(req.body.activity);
    const activityDto = plainToInstance(
      UpdateActivityDto,
      activityData
    );
    const errors = await validate(activityDto);
    if (errors.length > 0) {
      return createErrorResponse(
        res,
        400,
        errors
          .flatMap((error) =>
            Object.values(error.constraints ?? {})
          )
          .join(", ")
      );
    }
    const files = req.files as Record<
      string,
      Express.Multer.File[]
    >;
    const activity =
      await ActivityService.updateActivityByAdmin(
        Number(idDto.id),
        activityDto,
        files,
        req.user.id
      );
    return createResponse(
      res,
      200,
      "แก้ไขกิจกรรมสำเร็จ",
      activity
    );
  } catch (error) {
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
}

/**
 * คำอธิบาย : SuperAdmin อนุมัติกิจกรรม
 * Input : req.params.id - รหัสกิจกรรม, req.user.id - ผู้อนุมัติ
 * Output : 200 - กิจกรรมที่อนุมัติแล้ว
 *          400 - ไม่พบกิจกรรม หรือกิจกรรมถูกดำเนินการไปแล้ว
 */
export async function approveActivityBySuperAdmin(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params as unknown as ActivityIdParamDto;
    const userId = Number((req as any).user?.id);
    const result = await ActivityService.approveActivityBySuperAdmin(
      Number(id),
      userId
    );
    return createResponse(
      res,
      200,
      "Approve Activity Success",
      result
    );
  } catch (error) {
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
}

/**
 * คำอธิบาย : SuperAdmin ปฏิเสธกิจกรรม
 * Input : req.params.id - รหัสกิจกรรม,
 *         req.user.id - ผู้ตรวจสอบ,
 *         req.body.reason - เหตุผลที่ปฏิเสธ
 * Output : 200 - กิจกรรมที่ถูก Reject
 *          400 - ไม่พบกิจกรรม หรือกิจกรรมถูกดำเนินการไปแล้ว
 */
export async function rejectActivityBySuperAdmin(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params as unknown as ActivityRejectDto;
    const { reason } = req.body;
    const userId = Number((req as any).user?.id);
    const result =
      await ActivityService.rejectActivityBySuperAdmin(
        Number(id),
        userId,
        reason
      );
    return createResponse(
      res,
      200,
      "Reject Activity Success",
      result
    );
  } catch (error) {
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
}

/**
 * คำอธิบาย : SuperAdmin ดึงรายการกิจกรรมที่รออนุมัติ
 * Input : req.query - page, limit, search
 * Output : 200 - รายการกิจกรรม Pending พร้อม Pagination
 */
export async function getRequestsActivitiesForSuperAdmin(
  req: Request,
  res: Response
) {
  try {
    const query = req.query as unknown as ActivityRequestQueryDto;
    const result =
      await ActivityService.getRequestsActivitiesForSuperAdmin({
        page: query.page ? Number(query.page) : 1,
        limit: query.limit ? Number(query.limit) : 10,
        search: query.search,
      });
    return createResponse(
      res,
      200,
      "Get Request Activities Success",
      result
    );
  } catch (error) {
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
}

/**
 * คำอธิบาย : SuperAdmin ดูรายละเอียดกิจกรรมที่รออนุมัติ
 * Input : req.params.id - รหัสกิจกรรม
 * Output : 200 - รายละเอียดกิจกรรม Pending
 *          400 - ไม่พบกิจกรรมที่รออนุมัติ
 */
export async function getRequestsActivityDetailForSuperAdmin(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params as unknown as ActivityIdParamDto;
    const result =
      await ActivityService.getRequestsActivityDetailForSuperAdmin(
        Number(id)
      );
    return createResponse(
      res,
      200,
      "Get Request Activity Detail Success",
      result
    );
  } catch (error) {
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
}

/**
 * คำอธิบาย : ดึงรายละเอียดกิจกรรมสำหรับหน้า Home
 * Input : req.params.id - รหัส Activity
 * Output : 200 - รายละเอียดกิจกรรม พร้อมกิจกรรมที่เกี่ยวข้อง
 *          400 - ไม่พบกิจกรรม
 */
export async function getActivityDetailForHome(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params as unknown as ActivityIdParamDto;
    const result =
      await ActivityService.getActivityDetailForHome(
        Number(id)
      );
    return createResponse(
      res,
      200,
      "Get Activity Detail Success",
      result
    );
  } catch (error) {
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
}

/**
 * คำอธิบาย : ดึงรายการกิจกรรมสำหรับหน้า Home ตามเดือนปัจจุบัน
 * Input : query - ข้อมูล Pagination
 * Output : 200 - รายการกิจกรรมที่จัดในเดือนปัจจุบัน พร้อมข้อมูล Pagination
 */
export async function getHomeActivity(
  req: Request,
  res: Response
) {
  try {
    const result = await ActivityService.getHomeActivity(
      req.query as ActivityQueryDto
    );

    return createResponse(
      res,
      200,
      "Get Home Activities Success",
      result
    );
  } catch (error) {
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
}
/*
 * คำอธิบาย : Admin ดูรายการกิจกรรม Draft ของตัวเอง
 */
export const getDraftActivityByAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const activities =
      await ActivityService.getDraftActivityByAdmin(
        req.user.id
      );
    return createResponse(
      res,
      200,
      "Get draft activities successfully",
      activities
    );
  } catch(error) {
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
};

/*
 * คำอธิบาย : Admin ลบกิจกรรม Draft ของตัวเอง
 * Input : params.id - รหัสกิจกรรม
 * Output : กิจกรรมถูกลบสำเร็จ
 */
export const deleteDraftActivityByAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const activity =
      await ActivityService.deleteDraftActivityByAdmin(
        Number(req.params.id),
        req.user.id
      );
    return createResponse(
      res,
      200,
      "Delete draft activity successfully",
      activity
    );
  } catch(error) {
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
};

/**
 * คำอธิบาย : SuperAdmin ดึงประวัติกิจกรรมที่สิ้นสุดแล้ว
 * Input : req.query - Pagination และ Search
 * Output : 200 - รายการประวัติกิจกรรม
 *          400 - Error message
 */
export async function getActivityHistoryBySuperAdmin(
  req: Request,
  res: Response
) {
  try {
    const query = req.query as unknown as PaginationDto;
    const result =
      await ActivityService.getActivityHistoryBySuperAdmin(query);
    return createResponse(
      res,
      200,
      "Get Activity History Success",
      result
    );
  } catch (error) {
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
}

/**
 * คำอธิบาย : Admin ดึงประวัติกิจกรรมที่สิ้นสุดแล้วของตัวเอง
 * Input : req.user.id - เจ้าของกิจกรรม, req.query - Pagination และ Search
 * Output : 200 - รายการประวัติกิจกรรม
 *          400 - Error message
 */
export async function getActivityHistoryByAdmin(
  req: Request,
  res: Response
) {
  try {
    const userId = Number((req as any).user?.id);
    const query = req.query as unknown as PaginationDto;
    const result = await ActivityService.getActivityHistoryByAdmin(
      userId,
      query
    );
    return createResponse(
      res,
      200,
      "Get Activity History Success",
      result
    );
  } catch (error) {
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
}