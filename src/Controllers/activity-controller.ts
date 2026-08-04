/*
 * คำอธิบาย : Handler สำหรับดึงรายการกิจกรรมทั้งหมด
 * Input: req.query.{page, limit, status}
 * Output:
 * 200 - ข้อมูลกิจกรรมทั้งหมดพร้อม Pagination
 * 400 - Error message
*/

import type { Request, Response } from "express";

import {
  createResponse,
  createErrorResponse,
} from "../Libs/createResponse.js";

import * as ActivityService from "../Services/activity-service.js";

export const getActivityBySuperAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const activities = await ActivityService.getActivityBySuperAdmin();
    return createResponse(
      res,
      200,
      "Get activities successfully",
      activities
    );
  } catch (error) {
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
};

export const getActivityByAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const activities = await ActivityService.getActivityByAdmin(
      req.user.id
    );
    return createResponse(
      res,
      200,
      "Get activities successfully",
      activities
    );
  } catch (error) {
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
};

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

/*
 * คำอธิบาย : สร้างกิจกรรม
 */
export async function createActivityBySuperAdmin(req: Request, res: Response) {
  try {
    const activityData = JSON.parse(req.body.activity);

    const files = req.files as Record<string, Express.Multer.File[]>;

    const activity = await ActivityService.createActivityBySuperAdmin(
      activityData,
      files,
      req.user.id
    );
    res.status(201).json({
      success: true,
      message: "สร้างกิจกรรมสำเร็จ",
      data: activity,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/*
 * คำอธิบาย : สร้างกิจกรรมโดย Admin
 * Input : req.body ข้อมูลกิจกรรม
 * Output:
 * 201 - สร้างกิจกรรมสำเร็จ
 * 400 - Error message
 */
export async function createActivityByAdmin(req: Request, res: Response) {
  try {
    const activityData = JSON.parse(req.body.activity);

    const files = req.files as Record<string, Express.Multer.File[]>;

    const activity = await ActivityService.createActivityByAdmin(
      activityData,
      files,
      req.user.id
    );
    res.status(201).json({
      success: true,
      message: "สร้างกิจกรรมสำเร็จ",
      data: activity,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
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

/*
 * คำอธิบาย : แก้ไขกิจกรรมโดย SuperAdmin
 * Input : params.id - รหัสกิจกรรม, req.body - ข้อมูลกิจกรรมใหม่
 * Output:
 * 200 - แก้ไขกิจกรรมสำเร็จ
 * 400 - Error message
 */
export async function updateActivityBySuperAdmin(
  req: Request,
  res: Response
) {
  try {
    const activityId = Number(req.params.id);
    const activityData = JSON.parse(req.body.activity);
    const activity = await ActivityService.updateActivityBySuperAdmin(
      activityId,
      activityData,
      req.files as Record<string, Express.Multer.File[]>,
      req.user.id
    );
    return createResponse(
      res,
      200,
      "Update activity success",
      activity
    );
  } catch (error) {
    return createErrorResponse(
      res,
      500,
      "Update activity failed",
      error
    );
  }
}

/*
 * คำอธิบาย : แก้ไขกิจกรรมโดย Admin
 * Input : params.id - รหัสกิจกรรม, req.body - ข้อมูลกิจกรรมใหม่
 * Output:
 * 200 - แก้ไขกิจกรรมสำเร็จ
 * 400 - Error message
 */

export async function updateActivityByAdmin(
  req: Request,
  res: Response
) {
  try {
    const activityId = Number(req.params.id);
    const activityData = JSON.parse(req.body.activity);
    const activity = await ActivityService.updateActivityByAdmin(
      activityId,
      activityData,
      req.files as Record<string, Express.Multer.File[]>,
      req.user.id
    );

    return createResponse(
      res,
      200,
      "Update activity success",
      activity
    );
  } catch (error) {
    return createErrorResponse(
      res,
      500,
      "Update activity failed",
      error
    );
  }
}

/*
 * คำอธิบาย : SuperAdmin อนุมัติกิจกรรม
 */
export const approveActivityBySuperAdmin =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const activity =
        await ActivityService.approveActivityBySuperAdmin(
          Number(req.params.id),
          req.user.id
        );
      return createResponse(
        res,
        200,
        "Approve activity successfully",
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
 * คำอธิบาย : SuperAdmin Reject กิจกรรม
 */
export const rejectActivityBySuperAdmin =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const activity =
        await ActivityService.rejectActivityBySuperAdmin(
          Number(req.params.id),
          req.user.id,
          req.body.reason
        );
      return createResponse(
        res,
        200,
        "Reject activity successfully",
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
 * คำอธิบาย : SuperAdmin ดึงรายการกิจกรรมที่รออนุมัติ
 */
export const getRequestActivitiesForSuperAdmin =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const activities =
        await ActivityService.getRequestsActivitiesForSuperAdmin();
      return createResponse(
        res,
        200,
        "Get pending activities successfully",
        activities
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
 * คำอธิบาย : SuperAdmin ดูรายละเอียดกิจกรรมที่รออนุมัติ
 */
export const getRequestActivityDetailForSuperAdmin =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const activity =
        await ActivityService.getRequestsActivityDetailForSuperAdmin(
          Number(req.params.id)
        );
      return createResponse(
        res,
        200,
        "Get pending activity detail successfully",
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
 * คำอธิบาย : ดึงรายละเอียดกิจกรรมสำหรับหน้า Home
 * Input : params.id
 * Output : รายละเอียดกิจกรรมทั้งหมด
*/
export const getActivityDetailForHome =
async (
  req: Request,
  res: Response
)=>{
  try {
    const activity =
      await ActivityService.getActivityDetailForHome(
        Number(req.params.id)
      );
    return createResponse(
      res,
      200,
      "Get activity detail successfully",
      activity
    );
  } catch(error){
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
};

/*
 * คำอธิบาย : หน้า Home ดึงกิจกรรมเดือนปัจจุบัน
 */
export const getHomeActivity = async (
  req: Request,
  res: Response
) => {
  try {
    const activities =
      await ActivityService.getHomeActivity();
    return createResponse(
      res,
      200,
      "Get home activities successfully",
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

/*
 * คำอธิบาย : SuperAdmin ดึงประวัติกิจกรรมที่สิ้นสุดแล้วทั้งหมด
 * Input : -
 * Output : รายการกิจกรรมที่สิ้นสุดแล้วทั้งหมดในระบบ
 */
export async function getActivityHistoryBySuperAdmin(
  req: Request,
  res: Response
) {
  try {
    const activities =
      await ActivityService.getActivityHistoryBySuperAdmin();

    return createResponse(
      res,
      200,
      "Get activity history success",
      activities
    );
  } catch (error) {
    return createErrorResponse(
      res,
      500,
      "Get activity history failed",
      error
    );
  }
}

/*
 * คำอธิบาย : Admin ดึงประวัติกิจกรรมที่สิ้นสุดแล้วของตัวเอง
 * Input : req.user.id
 * Output : รายการกิจกรรมที่สิ้นสุดแล้วของผู้ใช้งาน
 */
export async function getActivityHistoryByAdmin(
  req: Request,
  res: Response
) {
  try {
    const activities =
      await ActivityService.getActivityHistoryByAdmin(req.user.id);

    return createResponse(
      res,
      200,
      "Get activity history success",
      activities
    );
  } catch (error) {
    return createErrorResponse(
      res,
      500,
      "Get activity history failed",
      error
    );
  }
}