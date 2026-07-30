/*
 * คำอธิบาย : Controller สำหรับจัดการข้อมูลหน้าแรก (Home)
*/

import type { Request, Response } from "express";
import {
  createResponse,
  createErrorResponse,
} from "../Libs/createResponse.js";
import * as HomeService from "../Services/home-service.js";

/*
 * คำอธิบาย : ดึงข้อมูลหน้า Home
 * Input : -
 * Output : Banner และ Activity Type
 */
export const getHomeData = async (
  req: Request,
  res: Response
) => {
  try {
    const data =
      await HomeService.getHomeData();
    return createResponse(
      res,
      200,
      "Get home data successfully",
      data
    );
  } catch(error) {
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
};