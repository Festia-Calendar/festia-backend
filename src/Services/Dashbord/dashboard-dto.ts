/**
 * คำอธิบาย :
 * DTO สำหรับรับ Query ของ Dashboard Activity
 *
 * Input :
 * - year     : ปีของกิจกรรม
 * - month    : เดือนของกิจกรรม 1-12
 * - zone     : ภาค
 * - province : จังหวัด
 *
 * หมายเหตุ :
 * - Admin ใช้ year, month
 * - Super Admin ใช้ year, month, zone, province
 */

export interface DashboardActivityQueryDto {
  startDate?: string;
  endDate?: string;
  zone?: string;
  province?: string;
  userId?: number;
}