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

export const createActivityBySuperAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const activity =
      await ActivityService.createActivityBySuperAdmin(
        req.user.id,
        req.body
      );
    return createResponse(
      res,
      201,
      "Create activity successfully",
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
 * คำอธิบาย : สร้างกิจกรรมโดย Admin
 * Input : req.body ข้อมูลกิจกรรม
 * Output:
 * 201 - สร้างกิจกรรมสำเร็จ
 * 400 - Error message
 */
export const createActivityByAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const activity =
      await ActivityService.createActivityByAdmin(
        req.user.id,
        req.body
      );
    return createResponse(
      res,
      201,
      "Create activity successfully",
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
 * คำอธิบาย : ลบกิจกรรมโดย SuperAdmin
 * Input : params.id - รหัสกิจกรรม
 * Output : กิจกรรมถูกลบสำเร็จ
*/
export const deleteActivityBySuperAdmin = async(
  req:Request,
  res:Response
)=>{
  try{
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
  }catch(error){
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
export const deleteActivityByAdmin = async(
  req:Request,
  res:Response
)=>{
  try{
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
  }catch(error){
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
export const updateActivityBySuperAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const activity =
      await ActivityService.updateActivityBySuperAdmin(
        Number(req.params.id),
        req.user.id,
        req.body
      );
    return createResponse(
      res,
      200,
      "Update activity successfully",
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
 * คำอธิบาย : แก้ไขกิจกรรมโดย Admin
 * Input : params.id - รหัสกิจกรรม, req.body - ข้อมูลกิจกรรมใหม่
 * Output:
 * 200 - แก้ไขกิจกรรมสำเร็จ
 * 400 - Error message
 */
export const updateActivityByAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const activity =
      await ActivityService.updateActivityByAdmin(
        Number(req.params.id),
        req.user.id,
        req.body
      );
    return createResponse(
      res,
      200,
      "Update activity successfully",
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