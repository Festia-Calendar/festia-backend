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

/*
 * คำอธิบาย : Handler สำหรับดึงรายการกิจกรรมทั้งหมด
 * Input: req
 * Output:
 * 200 - รายการกิจกรรม
 * 400 - Error message
 */
export async function listActivities(
  req: Request,
  res: Response
) {
  try {
    const result = await ActivityService.getActivities();
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