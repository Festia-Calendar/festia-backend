/*
 * คำอธิบาย :
 * Service สำหรับจัดการข้อมูล Activity
 * ใช้ Prisma ORM ในการติดต่อฐานข้อมูล
 */

import {ActivityApproveStatus, ActivityPublishStatus,} from "@prisma/client";
import prisma from "../Services/database-service.js";

/*
 * คำอธิบาย :
 * ดึงข้อมูลกิจกรรมทั้งหมดที่สามารถแสดงผลได้
 *
 * Input :
 * ไม่มี
 *
 * Output :
 * รายการ Activity พร้อม Location และ Schedule
 */
export async function getActivities() {

  const activityLists = await prisma.activity.findMany({

    where: {
      isDeleted: false,
    },

    include: {
      location: true,
      schedules: true,
    },

  });

  return activityLists;

}