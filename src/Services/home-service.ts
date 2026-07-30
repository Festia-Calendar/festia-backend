/*
 * คำอธิบาย :
 * Service สำหรับจัดการข้อมูลหน้าแรก (Home)
 * ประกอบด้วยการดึงข้อมูล carousel images และ activity types
 * โดยเชื่อมต่อกับฐานข้อมูลผ่าน Prisma
 */

import prisma from "../Services/database-service";

/*
 * คำอธิบาย :
 * ดึงข้อมูลสำหรับหน้าแรก รวมถึง carousel images และ activity types
 *
 * Input :
 * -
 *
 * Output :
 * object ประกอบด้วย carouselImages และ activityTypes
 */
export async function getHomeData() {

  /*
   * ดึง Banner สำหรับ Carousel หน้าแรก
   */
  const carouselImages =
    await prisma.banner.findMany({
      select: {
        image: true,
      },
      take: 5,
    });

  /*
   * ดึงประเภทกิจกรรมที่มีอยู่ในระบบ
   * เงื่อนไข:
   * - ไม่ถูกลบ
   * - อนุมัติแล้ว
   * - เผยแพร่แล้ว
   * - มีประเภทกิจกรรม
   */
  const activities =
    await prisma.activity.findMany({
      where: {
        isDeleted: false,
        statusApprove: "APPROVE",
        statusActivity: "PUBLISH",
        activityType: {
          not: null,
        },
      },
      select: {
        activityType: true,
      },
    });

  /*
   * แปลงข้อมูล ActivityType
   * - เอาเฉพาะชื่อประเภท
   * - ตัดข้อมูลซ้ำ
   */
  const activityTypes = [
    ...new Set(
      activities.map(
        (activity: {
          activityType: string | null;
        }) => activity.activityType
      )
    ),
  ];

  return {
    carouselImages,
    activityTypes,
  };
}