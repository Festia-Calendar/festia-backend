import {
  createErrorResponse,
  createResponse,
} from "../Libs/createResponse.js";

import {
  commonDto,
  type TypedHandlerFromDto,
} from "../Libs/Type/typedHandler.js";

import { SearchQueryDto } from "../Services/Search/search-dto.js";
import * as SearchService from "../Services/Search/search-service.js";

import { ActivityType } from "@prisma/client";

/**
 * DTO : searchDto
 *
 * วัตถุประสงค์ :
 * กำหนด schema ของ query สำหรับค้นหาและกรองกิจกรรมหน้า Home
 *
 * Input :
 * - keyword
 * - zone
 * - province
 * - district
 * - startDate
 * - endDate
 * - type
 * - page
 *
 * Output :
 * - 200 ข้อมูลกิจกรรม
 * - 400 Error message
 */
export const searchDto = {
  query: SearchQueryDto,
} satisfies commonDto;

/**
 * คำอธิบาย :
 * Handler สำหรับค้นหาและกรองกิจกรรมหน้า Home
 *
 * รองรับ :
 * - Magic Search
 * - ภูมิภาค
 * - จังหวัด
 * - อำเภอ
 * - วันที่เริ่มต้น
 * - วันที่สิ้นสุด
 * - ประเภทกิจกรรม
 * - Pagination
 *
 * จำนวนกิจกรรมต่อหน้า : 4 รายการ
 */
export const search: TypedHandlerFromDto<
  typeof searchDto
> = async (req, res) => {
  try {
    const keyword =
      req.query.keyword as string | undefined;

    const zone =
      req.query.zone as string | undefined;

    const province =
      req.query.province as string | undefined;

    const district =
      req.query.district as string | undefined;

    const startDate =
      req.query.startDate as string | undefined;

    const endDate =
      req.query.endDate as string | undefined;

    const type =
      req.query.type as ActivityType | undefined;

    const page =
      (req.query.page as number | undefined) ?? 1;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (Number.isNaN(start.getTime())) {
        return createErrorResponse(
          res,
          400,
          "รูปแบบวันที่เริ่มต้นไม่ถูกต้อง"
        );
      }

      if (Number.isNaN(end.getTime())) {
        return createErrorResponse(
          res,
          400,
          "รูปแบบวันที่สิ้นสุดไม่ถูกต้อง"
        );
      }

      if (start > end) {
        return createErrorResponse(
          res,
          400,
          "วันที่เริ่มต้นต้องไม่มากกว่าวันที่สิ้นสุด"
        );
      }
    }

    const result =
      await SearchService.searchActivities({
        keyword,
        zone,
        province,
        district,
        startDate,
        endDate,
        type,
        page,
      });

    return createResponse(
      res,
      200,
      "ดึงข้อมูลกิจกรรมสำเร็จ",
      result
    );
  } catch (error) {
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
};