import { Expose, Transform } from "class-transformer";
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import { ActivityType } from "@prisma/client";

/**
 * DTO : PaginationDto
 * วัตถุประสงค์ : กำหนด schema สำหรับ pagination, search และ filter parameters
 *
 * Input : query parameters
 *   - page
 *   - limit
 *   - search
 *   - activityType
 *   - zone
 *   - province
 *   - district
 *   - subDistrict
 *   - startDate
 *   - dueDate
 */
export class PaginationDto {
  @Expose()
  @IsOptional()
  @Transform(({ value }) => {
    const num = parseInt(value);
    return !isNaN(num) && num > 0 ? num : 1;
  })
  @IsInt({ message: "Page must be a number" })
  @Min(1, { message: "Page must be greater than 0" })
  page?: number = 1;

  @Expose()
  @IsOptional()
  @Transform(({ value }) => {
    const num = parseInt(value);
    return !isNaN(num) && num > 0 && num <= 100 ? num : 10;
  })
  @IsInt({ message: "Limit must be a number" })
  @Min(1, { message: "Limit must be at least 1" })
  @Max(100, { message: "Limit cannot exceed 100" })
  limit?: number = 10;

  // Search ชื่อกิจกรรม
  @Expose()
  @IsOptional()
  @IsString()
  search?: string;

  // ประเภทกิจกรรม
  @Expose()
  @IsOptional()
  @IsEnum(ActivityType, {
    message: "Invalid activity type",
  })
  activityType?: ActivityType;

  // ภูมิภาค
  @Expose()
  @IsOptional()
  @IsString()
  zone?: string;

  // จังหวัด
  @Expose()
  @IsOptional()
  @IsString()
  province?: string;

  // อำเภอ
  @Expose()
  @IsOptional()
  @IsString()
  district?: string;

  // ตำบล
  @Expose()
  @IsOptional()
  @IsString()
  subDistrict?: string;

  // วันที่เริ่มกิจกรรม
  @Expose()
  @IsOptional()
  @IsDateString(
    {},
    {
      message: "Start date must be a valid date",
    }
  )
  startDate?: string;

  // วันที่สิ้นสุดกิจกรรม
  @Expose()
  @IsOptional()
  @IsDateString(
    {},
    {
      message: "Due date must be a valid date",
    }
  )
  dueDate?: string;
}

/*
 * Type : PaginationResponse
 * คำอธิบาย : Type สำหรับ response ที่มี pagination metadata
 */
export type PaginationResponse<T> = {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
};