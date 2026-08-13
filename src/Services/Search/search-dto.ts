import { Expose, Transform } from "class-transformer";
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

import { PaginationDto } from "../pagination-dto.js";

/**
 * DTO: SearchQueryDto
 *
 * วัตถุประสงค์ :
 * ตรวจสอบข้อมูล Query สำหรับค้นหาและกรองกิจกรรมหน้า Home
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
 * Query ที่ผ่านการตรวจสอบและแปลงข้อมูลแล้ว
 */
export class SearchQueryDto extends PaginationDto {
  // =====================================================
  // Magic Search
  // =====================================================

  @Expose()
  @IsOptional()
  @IsString({
    message: "keyword ต้องเป็นข้อความ",
  })
  @Transform(({ value }) => {
    if (typeof value !== "string") {
      return undefined;
    }

    const keyword = value.trim();

    return keyword !== "" ? keyword : undefined;
  })
  keyword?: string;

  // =====================================================
  // ภูมิภาค
  // =====================================================

  @Expose()
  @IsOptional()
  @IsString({
    message: "zone ต้องเป็นข้อความ",
  })
  @Transform(({ value }) => {
    if (typeof value !== "string") {
      return undefined;
    }

    const zone = value.trim();

    return zone !== "" ? zone : undefined;
  })
  zone?: string;

  // =====================================================
  // จังหวัด
  // =====================================================

  @Expose()
  @IsOptional()
  @IsString({
    message: "province ต้องเป็นข้อความ",
  })
  @Transform(({ value }) => {
    if (typeof value !== "string") {
      return undefined;
    }

    const province = value.trim();

    return province !== "" ? province : undefined;
  })
  province?: string;

  // =====================================================
  // อำเภอ
  // =====================================================

  @Expose()
  @IsOptional()
  @IsString({
    message: "district ต้องเป็นข้อความ",
  })
  @Transform(({ value }) => {
    if (typeof value !== "string") {
      return undefined;
    }

    const district = value.trim();

    return district !== "" ? district : undefined;
  })
  district?: string;

  // =====================================================
  // วันที่เริ่มต้น
  // =====================================================

  @Expose()
  @IsOptional()
  @IsString({
    message: "startDate ต้องเป็นข้อความ",
  })
  startDate?: string;

  // =====================================================
  // วันที่สิ้นสุด
  // =====================================================

  @Expose()
  @IsOptional()
  @IsString({
    message: "endDate ต้องเป็นข้อความ",
  })
  endDate?: string;

  // =====================================================
  // ประเภทกิจกรรม
  // =====================================================

  @Expose()
  @IsOptional()
  @IsString({
    message: "type ต้องเป็นข้อความ",
  })
  @IsIn(
    [
      "CULTURAL_FESTIVAL",
      "EXHIBITION_ART",
      "PERFORMANCE_MUSIC",
      "FOOD_DRINK_FESTIVAL",
      "MARKET_FAIR",
      "TRAINING_SEMINAR",
      "SPORT_RECREATION",
      "COMMUNITY_TOURISM",
    ],
    {
      message:
        "type ต้องเป็นประเภทกิจกรรมที่ระบบกำหนด",
    }
  )
  type?:
    | "CULTURAL_FESTIVAL"
    | "EXHIBITION_ART"
    | "PERFORMANCE_MUSIC"
    | "FOOD_DRINK_FESTIVAL"
    | "MARKET_FAIR"
    | "TRAINING_SEMINAR"
    | "SPORT_RECREATION"
    | "COMMUNITY_TOURISM";

  // =====================================================
  // Page
  // =====================================================

  @Expose()
  @IsOptional()
  @Transform(({ value }) => {
    const page = Number(value);

    return Number.isInteger(page) && page >= 1
      ? page
      : value;
  })
  @IsInt({
    message: "page ต้องเป็นจำนวนเต็ม",
  })
  @Min(1, {
    message: "page ต้องมากกว่าหรือเท่ากับ 1",
  })
  page?: number;
}