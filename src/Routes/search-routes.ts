import { Router } from "express";
import * as SearchController from "../Controllers/search-controller.js";

const searchRoutes = Router();

/**
 * คำอธิบาย : ค้นหาและกรองกิจกรรมสำหรับหน้า Home
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
searchRoutes.get(
  "/search",
  SearchController.search
);

export { searchRoutes };