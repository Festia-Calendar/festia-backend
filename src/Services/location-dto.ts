import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  Max,
} from "class-validator";

/**
 * DTO: LocationDto
 *
 * วัตถุประสงค์:
 * ตรวจสอบข้อมูลสถานที่จัดกิจกรรม
 *
 * Input:
 * name, zone, province, district, subDistrict,
 * detail, latitude, longitude
 *
 * Output:
 * ข้อมูล Location ที่ผ่านการตรวจสอบ
 */
export class LocationDto {
  @IsString()
  @IsNotEmpty({
    message: "name ห้ามว่าง",
  })
  @MaxLength(150, {
    message: "name ยาวเกิน 150 ตัวอักษร",
  })
  name!: string;

  @IsString()
  @IsNotEmpty({
    message: "zone ห้ามว่าง",
  })
  @MaxLength(50, {
    message: "zone ยาวเกิน 50 ตัวอักษร",
  })
  zone!: string;

  @IsString()
  @IsNotEmpty({
    message: "province ห้ามว่าง",
  })
  @MaxLength(100, {
    message: "province ยาวเกิน 100 ตัวอักษร",
  })
  province!: string;

  @IsString()
  @IsNotEmpty({
    message: "district ห้ามว่าง",
  })
  @MaxLength(100, {
    message: "district ยาวเกิน 100 ตัวอักษร",
  })
  district!: string;

  @IsString()
  @IsNotEmpty({
    message: "subDistrict ห้ามว่าง",
  })
  @MaxLength(100, {
    message: "subDistrict ยาวเกิน 100 ตัวอักษร",
  })
  subDistrict!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: "detail ยาวเกิน 500 ตัวอักษร",
  })
  detail?: string;

  @IsNumber(
    {},
    {
      message: "latitude ต้องเป็นตัวเลข",
    },
  )
  @Min(-90, {
    message: "latitude ต้องไม่น้อยกว่า -90",
  })
  @Max(90, {
    message: "latitude ต้องไม่มากกว่า 90",
  })
  latitude!: number;

  @IsNumber(
    {},
    {
      message: "longitude ต้องเป็นตัวเลข",
    },
  )
  @Min(-180, {
    message: "longitude ต้องไม่น้อยกว่า -180",
  })
  @Max(180, {
    message: "longitude ต้องไม่มากกว่า 180",
  })
  longitude!: number;
}