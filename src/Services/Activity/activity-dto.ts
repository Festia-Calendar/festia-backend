import {
  ActivityApproveStatus,
  ActivityPublishStatus,
  ActivityType,
  ImageType,
} from "@prisma/client";

import { Type } from "class-transformer";

import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";

import { LocationDto } from "../location-dto.js";

/**
 * DTO: ActivityFileDto
 *
 * วัตถุประสงค์:
 * ตรวจสอบข้อมูลไฟล์ของ Activity
 *
 * Input:
 * filePath, type
 *
 * Output:
 * ข้อมูลไฟล์ที่ผ่านการตรวจสอบ
 */
export class ActivityFileDto {
  @IsString()
  @IsNotEmpty({
    message: "filePath ห้ามว่าง",
  })
  filePath!: string;

  @IsEnum(ImageType, {
    message: "type ต้องเป็น COVER | GALLERY | VIDEO | LOGO",
  })
  type!: ImageType;
}

/**
 * DTO: ActivityScheduleDto
 *
 * วัตถุประสงค์:
 * ตรวจสอบข้อมูลกำหนดการของ Activity
 *
 * ใช้ทั้งตอนสร้างและแก้ไข Activity
 *
 * Input:
 * id, title, description, startDateTime, endDateTime,
 * fileIndexes, deleteFileIds
 *
 * Output:
 * ข้อมูลกำหนดการที่ผ่านการตรวจสอบ
 */
export class ActivityScheduleDto {
  /**
   * ใช้ตอน Update
   * ถ้ามี id = แก้ไขกำหนดการเดิม
   * ถ้าไม่มี id = เพิ่มกำหนดการใหม่
   */
  @IsOptional()
  @IsInt({
    message: "id ต้องเป็นตัวเลขจำนวนเต็ม",
  })
  @Min(1, {
    message: "id ต้องมากกว่า 0",
  })
  id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(150, {
    message: "title ยาวเกิน 150 ตัวอักษร",
  })
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: "description ยาวเกิน 500 ตัวอักษร",
  })
  description?: string;

  @IsString()
  @IsNotEmpty({
    message: "startDateTime ห้ามว่าง",
  })
  startDateTime!: string;

  @IsString()
  @IsNotEmpty({
    message: "endDateTime ห้ามว่าง",
  })
  endDateTime!: string;

  /**
   * Index ของไฟล์ใน scheduleFiles
   *
   * ใช้ตอน Create / Update
   */
  @IsOptional()
  @IsArray({
    message: "fileIndexes ต้องเป็น array",
  })
  @IsInt({
    each: true,
    message: "fileIndexes ทุกตัวต้องเป็นตัวเลขจำนวนเต็ม",
  })
  @Min(0, {
    each: true,
    message: "fileIndexes ต้องไม่น้อยกว่า 0",
  })
  fileIndexes?: number[];

  /**
   * ID ของรูปเดิมที่ต้องการลบ
   *
   * ใช้ตอน Update
   */
  @IsOptional()
  @IsArray({
    message: "deleteFileIds ต้องเป็น array",
  })
  @ArrayUnique({
    message: "deleteFileIds ต้องไม่ซ้ำกัน",
  })
  @IsInt({
    each: true,
    message: "deleteFileIds ทุกตัวต้องเป็นตัวเลขจำนวนเต็ม",
  })
  @Min(1, {
    each: true,
    message: "deleteFileIds ต้องมากกว่า 0",
  })
  deleteFileIds?: number[];
}

/**
 * DTO: ActivityDto
 *
 * วัตถุประสงค์:
 * ตรวจสอบข้อมูลเมื่อสร้าง Activity
 *
 * Input:
 * location,
 * name,
 * tagline,
 * description,
 * activityType,
 * phone,
 * lineUrl,
 * facebookUrl,
 * price,
 * statusActivity,
 * startDate,
 * dueDate,
 * schedules
 *
 * Output:
 * ข้อมูล Activity ที่ผ่านการตรวจสอบ
 */
export class ActivityDto {
  @ValidateNested()
  @Type(() => LocationDto)
  @IsNotEmpty({
    message: "location ห้ามว่าง",
  })
  location!: LocationDto;

  @IsString()
  @IsNotEmpty({
    message: "name ห้ามว่าง",
  })
  @MaxLength(100, {
    message: "name ยาวเกิน 100 ตัวอักษร",
  })
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: "tagline ยาวเกิน 500 ตัวอักษร",
  })
  tagline?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: "description ยาวเกิน 500 ตัวอักษร",
  })
  description?: string;

  @IsEnum(ActivityType, {
    message:
      "activityType ต้องเป็น CULTURAL_FESTIVAL | EXHIBITION_ART | PERFORMANCE_MUSIC | FOOD_DRINK_FESTIVAL | MARKET_FAIR | TRAINING_SEMINAR | SPORT_RECREATION | COMMUNITY_TOURISM",
  })
  activityType!: ActivityType;

  @IsOptional()
  @IsString()
  @MaxLength(20, {
    message: "phone ยาวเกิน 20 ตัวอักษร",
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, {
    message: "lineUrl ยาวเกิน 255 ตัวอักษร",
  })
  lineUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, {
    message: "facebookUrl ยาวเกิน 255 ตัวอักษร",
  })
  facebookUrl?: string;

  @IsOptional()
  @IsNumber(
    {},
    {
      message: "price ต้องเป็นตัวเลข",
    },
  )
  @Min(0, {
    message: "price ต้องไม่น้อยกว่า 0",
  })
  price?: number;

  @IsEnum(ActivityPublishStatus, {
    message: "statusActivity ต้องเป็น PUBLISH | UNPUBLISH | DRAFT",
  })
  statusActivity!: ActivityPublishStatus;

  /**
   * ไม่จำเป็นต้องรับจาก Frontend
   *
   * Service จะกำหนดสถานะเอง:
   * Admin -> PENDING
   * SuperAdmin -> APPROVE
   */
  @IsOptional()
  @IsEnum(ActivityApproveStatus, {
    message: "statusApprove ต้องเป็น PENDING | APPROVE | REJECTED",
  })
  statusApprove?: ActivityApproveStatus;

  @IsString()
  @IsNotEmpty({
    message: "startDate ห้ามว่าง",
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "startDate ต้องเป็นรูปแบบ yyyy-mm-dd",
  })
  startDate!: string;

  @IsString()
  @IsNotEmpty({
    message: "dueDate ห้ามว่าง",
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "dueDate ต้องเป็นรูปแบบ yyyy-mm-dd",
  })
  dueDate!: string;

  @IsArray({
    message: "schedules ต้องเป็น array",
  })
  @ValidateNested({
    each: true,
  })
  @Type(() => ActivityScheduleDto)
  schedules!: ActivityScheduleDto[];
}

/**
 * DTO: UpdateActivityDto
 *
 * วัตถุประสงค์:
 * ตรวจสอบข้อมูลเมื่อแก้ไข Activity
 *
 * Input:
 * ข้อมูล Activity ที่ต้องการแก้ไข
 *
 * Output:
 * ข้อมูล Activity ที่ผ่านการตรวจสอบ
 */
export class UpdateActivityDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @IsOptional()
  @IsString()
  @IsNotEmpty({
    message: "name ห้ามว่าง",
  })
  @MaxLength(100, {
    message: "name ยาวเกิน 100 ตัวอักษร",
  })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: "tagline ยาวเกิน 500 ตัวอักษร",
  })
  tagline?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: "description ยาวเกิน 500 ตัวอักษร",
  })
  description?: string;

  @IsOptional()
  @IsEnum(ActivityType, {
    message:
      "activityType ต้องเป็น CULTURAL_FESTIVAL | EXHIBITION_ART | PERFORMANCE_MUSIC | FOOD_DRINK_FESTIVAL | MARKET_FAIR | TRAINING_SEMINAR | SPORT_RECREATION | COMMUNITY_TOURISM",
  })
  activityType?: ActivityType;

  @IsOptional()
  @IsString()
  @MaxLength(20, {
    message: "phone ยาวเกิน 20 ตัวอักษร",
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, {
    message: "lineUrl ยาวเกิน 255 ตัวอักษร",
  })
  lineUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, {
    message: "facebookUrl ยาวเกิน 255 ตัวอักษร",
  })
  facebookUrl?: string;

  @IsOptional()
  @IsNumber(
    {},
    {
      message: "price ต้องเป็นตัวเลข",
    },
  )
  @Min(0, {
    message: "price ต้องไม่น้อยกว่า 0",
  })
  price?: number;

  @IsOptional()
  @IsEnum(ActivityPublishStatus, {
    message: "statusActivity ต้องเป็น PUBLISH | UNPUBLISH | DRAFT",
  })
  statusActivity?: ActivityPublishStatus;

  @IsOptional()
  @IsEnum(ActivityApproveStatus, {
    message: "statusApprove ต้องเป็น PENDING | APPROVE | REJECTED",
  })
  statusApprove?: ActivityApproveStatus;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "startDate ต้องเป็นรูปแบบ yyyy-mm-dd",
  })
  startDate?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "dueDate ต้องเป็นรูปแบบ yyyy-mm-dd",
  })
  dueDate?: string;

  @IsOptional()
  @IsArray({
    message: "schedules ต้องเป็น array",
  })
  @ValidateNested({
    each: true,
  })
  @Type(() => ActivityScheduleDto)
  schedules?: ActivityScheduleDto[];

  /**
   * ID ของ ActivityFile ที่ต้องการลบ
   */
  @IsOptional()
  @IsArray({
    message: "mediaDeleteIds ต้องเป็น array",
  })
  @ArrayUnique({
    message: "mediaDeleteIds ต้องไม่ซ้ำกัน",
  })
  @IsInt({
    each: true,
    message: "mediaDeleteIds ทุกตัวต้องเป็นตัวเลขจำนวนเต็ม",
  })
  @Min(1, {
    each: true,
    message: "mediaDeleteIds ต้องมากกว่า 0",
  })
  mediaDeleteIds?: number[];

  /**
   * ID ของ ActivitySchedule ที่ต้องการลบ
   */
  @IsOptional()
  @IsArray({
    message: "scheduleDeleteIds ต้องเป็น array",
  })
  @ArrayUnique({
    message: "scheduleDeleteIds ต้องไม่ซ้ำกัน",
  })
  @IsInt({
    each: true,
    message: "scheduleDeleteIds ทุกตัวต้องเป็นตัวเลขจำนวนเต็ม",
  })
  @Min(1, {
    each: true,
    message: "scheduleDeleteIds ต้องมากกว่า 0",
  })
  scheduleDeleteIds?: number[];
}

/**
 * DTO: ActivityIdParamDto
 *
 * วัตถุประสงค์:
 * ตรวจสอบ Activity ID จาก URL
 *
 * Input:
 * id
 *
 * Output:
 * Activity ID ที่ผ่านการตรวจสอบ
 */
export class ActivityIdParamDto {
  @IsNumberString(
    {},
    {
      message: "id ต้องเป็นตัวเลข",
    },
  )
  id!: string;
}

/**
 * DTO: ActivityQueryDto
 *
 * วัตถุประสงค์:
 * ตรวจสอบ Query สำหรับรายการ Activity
 *
 * Input:
 * page, limit, search
 *
 * Output:
 * Query ที่ผ่านการตรวจสอบ
 */
export class ActivityQueryDto {
  @IsOptional()
  @IsNumberString(
    {},
    {
      message: "page ต้องเป็นตัวเลข",
    },
  )
  page?: string;

  @IsOptional()
  @IsNumberString(
    {},
    {
      message: "limit ต้องเป็นตัวเลข",
    },
  )
  limit?: string;

  @IsOptional()
  @IsString({
    message: "search ต้องเป็นข้อความ",
  })
  search?: string;
}

/**
 * DTO: ActivityHistoryQueryDto
 *
 * วัตถุประสงค์:
 * ตรวจสอบ Query สำหรับประวัติ Activity
 *
 * Input:
 * page, limit, search
 *
 * Output:
 * Query ที่ผ่านการตรวจสอบ
 */
export class ActivityHistoryQueryDto {
  @IsOptional()
  @IsNumberString(
    {},
    {
      message: "page ต้องเป็นตัวเลข",
    },
  )
  page?: string;

  @IsOptional()
  @IsNumberString(
    {},
    {
      message: "limit ต้องเป็นตัวเลข",
    },
  )
  limit?: string;

  @IsOptional()
  @IsString({
    message: "search ต้องเป็นข้อความ",
  })
  search?: string;
}

/**
 * DTO: ActivityRequestQueryDto
 *
 * วัตถุประสงค์:
 * ตรวจสอบ Query สำหรับรายการ Activity ที่รออนุมัติ
 *
 * Input:
 * page, limit, search
 *
 * Output:
 * Query ที่ผ่านการตรวจสอบ
 */
export class ActivityRequestQueryDto {
  @IsOptional()
  @IsNumberString(
    {},
    {
      message: "page ต้องเป็นตัวเลข",
    },
  )
  page?: string;

  @IsOptional()
  @IsNumberString(
    {},
    {
      message: "limit ต้องเป็นตัวเลข",
    },
  )
  limit?: string;

  @IsOptional()
  @IsString({
    message: "search ต้องเป็นข้อความ",
  })
  search?: string;
}

/**
 * DTO: ActivityApproveDto
 *
 * วัตถุประสงค์:
 * ตรวจสอบข้อมูลเมื่ออนุมัติ Activity
 *
 * Input:
 * id
 *
 * Output:
 * ข้อมูลที่ผ่านการตรวจสอบ
 */
export class ActivityApproveDto {
  @IsNumberString(
    {},
    {
      message: "id ต้องเป็นตัวเลข",
    },
  )
  id!: string;
}

/**
 * DTO: ActivityRejectDto
 *
 * วัตถุประสงค์:
 * ตรวจสอบข้อมูลเมื่อปฏิเสธ Activity
 *
 * Input:
 * id, reason
 *
 * Output:
 * ข้อมูลที่ผ่านการตรวจสอบ
 */
export class ActivityRejectDto {
  @IsNumberString(
    {},
    {
      message: "id ต้องเป็นตัวเลข",
    },
  )
  id!: string;

  @IsString()
  @IsNotEmpty({
    message: "reason ห้ามว่าง",
  })
  @MaxLength(100, {
    message: "reason ยาวเกิน 100 ตัวอักษร",
  })
  reason!: string;
}

/**
 * DTO: UpdateParticipantStatusBodyDto
 *
 * วัตถุประสงค์:
 * ตรวจสอบสถานะการเข้าร่วมกิจกรรม
 *
 * Input:
 * isParticipate
 *
 * Output:
 * สถานะการเข้าร่วมที่ผ่านการตรวจสอบ
 */
export class UpdateParticipantStatusBodyDto {
  @IsBoolean({
    message: "isParticipate ต้องเป็น boolean",
  })
  isParticipate!: boolean;
}