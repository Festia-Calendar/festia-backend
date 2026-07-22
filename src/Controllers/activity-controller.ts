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