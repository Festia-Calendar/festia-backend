import {
  IsNotEmpty,
  IsString,
} from "class-validator";

/**
 * DTO : LoginDto
 * วัตถุประสงค์ : โครงสร้างข้อมูลสำหรับเข้าสู่ระบบ
 * Input : username, password
 * Output : ข้อมูลสำหรับตรวจสอบสิทธิ์ผู้ใช้งาน
 */
export class LoginDto {
  @IsString()
  @IsNotEmpty({
    message: "ชื่อผู้ใช้หรืออีเมลห้ามว่าง",
  })
  username!: string;

  @IsString()
  @IsNotEmpty({
    message: "รหัสผ่านห้ามว่าง",
  })
  password!: string;
}