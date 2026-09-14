/*
 * คำอธิบาย :
 * Service สำหรับสร้างและดึงข้อมูล Dashboard Activity
 */
import prisma from "../database-service.js";
import type { DashboardActivityQueryDto } from "../Dashbord/dashboard-dto.js";

/*
 * คำอธิบาย :
 * สร้างเงื่อนไขสำหรับค้นหาข้อมูล Activity
 *
 * Input :
 * - query : ข้อมูลสำหรับกรอง Dashboard
 *
 * Output :
 * เงื่อนไขสำหรับค้นหาข้อมูล Activity
 */
function buildActivityWhere(query: DashboardActivityQueryDto) {
  const where: any = {
    statusActivity: "PUBLISH",
    isDeleted: false,
  };

  if (query.userId) {
    where.createById = query.userId;
  }

  /*
   * กรองตามช่วงเวลา startDate ถึง endDate
   */
  if (query.startDate && query.endDate) {
    const start = new Date(`${query.startDate}T00:00:00`);
    const end = new Date(`${query.endDate}T23:59:59`);
    where.startDate = {
      gte: start,
      lte: end,
    };
  } else if (query.startDate) {
    const start = new Date(`${query.startDate}T00:00:00`);
    where.startDate = {
      gte: start,
    };
  } else if (query.endDate) {
    const end = new Date(`${query.endDate}T23:59:59`);
    where.startDate = {
      lte: end,
    };
  }

  /*
   * กรองตามภาคและจังหวัด
   */
  if (query.zone || query.province) {
    where.location = {};

    if (query.zone) {
      where.location.zone = query.zone;
    }

    if (query.province) {
      where.location.province = query.province;
    }
  }

  return where;
}

/*
 * คำอธิบาย :
 * ดึงจำนวนกิจกรรมแยกตามประเภท
 *
 * Input :
 * - query : ข้อมูลสำหรับกรอง Dashboard
 *
 * Output :
 * จำนวนกิจกรรมแยกตามประเภท
 */
export async function getActivityByType(query: DashboardActivityQueryDto) {
  const where = buildActivityWhere(query);

  const result = await prisma.activity.groupBy({
    by: ["activityType"],
    where: {
      ...where,
      activityType: {
        not: null,
      },
    },
    _count: {
      id: true,
    },
  });

  return result.map((item) => ({
    type: item.activityType,
    count: item._count.id,
  }));
}

/*
 * คำอธิบาย :
 * ดึงจำนวนกิจกรรมแยกตามเดือน
 *
 * Input :
 * - query : ข้อมูลสำหรับกรอง Dashboard
 *
 * Output :
 * จำนวนกิจกรรมของแต่ละเดือน
 */
export async function getActivityByMonth(query: DashboardActivityQueryDto) {
  const where = buildActivityWhere(query);

  const activities = await prisma.activity.findMany({
    where,
    select: {
      startDate: true,
    },
  });

  const monthlyCount = Array.from(
    { length: 12 },
    (_, index) => ({
      month: index + 1,
      count: 0,
    })
  );

  for (const activity of activities) {
    if (!activity.startDate) {
      continue;
    }

    const month = activity.startDate.getMonth();
    monthlyCount[month].count += 1;
  }

  return monthlyCount;
}

/*
 * คำอธิบาย :
 * ดึง 10 อันดับกิจกรรมที่มีจำนวนการเข้าชมสูงสุด
 *
 * Input :
 * - query : ข้อมูลสำหรับกรอง Dashboard
 *
 * Output :
 * 10 อันดับกิจกรรมที่มี viewCount สูงสุด
 */
export async function getTop10Activities(query: DashboardActivityQueryDto) {
  const where = buildActivityWhere(query);

  return await prisma.activity.findMany({
    where,
    orderBy: {
      viewCount: "desc",
    },
    take: 10,
    select: {
      id: true,
      name: true,
      activityType: true,
      viewCount: true,
      startDate: true,
      location: {
        select: {
          name: true,
          zone: true,
          province: true,
        },
      },
    },
  });
}

/*
 * คำอธิบาย :
 * ดึงจำนวนกิจกรรมแยกตามภาค
 *
 * Input :
 * - query : ข้อมูลสำหรับกรอง Dashboard
 *
 * Output :
 * จำนวนกิจกรรมแยกตามภาค
 */
export async function getActivityByZone(query: DashboardActivityQueryDto) {
  const where = buildActivityWhere({
    ...query,
    zone: undefined, // ไม่ใช้ zone ในการกรองตัวเอง
  });

  const activities = await prisma.activity.findMany({
    where,
    select: {
      location: {
        select: {
          zone: true,
        },
      },
    },
  });

  const zoneMap = new Map<string, number>();

  for (const activity of activities) {
    const zone = activity.location?.zone;

    if (!zone) {
      continue;
    }

    zoneMap.set(zone, (zoneMap.get(zone) ?? 0) + 1);
  }

  return Array.from(zoneMap.entries()).map(([zone, count]) => ({
    zone,
    count,
  }));
}

/*
 * คำอธิบาย :
 * ดึงจำนวนกิจกรรมแยกตามจังหวัด
 *
 * Input :
 * - query : ข้อมูลสำหรับกรอง Dashboard
 *
 * Output :
 * จำนวนกิจกรรมแยกตามจังหวัด
 */
export async function getActivityByProvince(query: DashboardActivityQueryDto) {
  const where = buildActivityWhere(query);

  const activities = await prisma.activity.findMany({
    where,
    select: {
      viewCount: true, // ดึงยอดวิวมาด้วย
      location: {
        select: {
          province: true,
        },
      },
    },
  });

  // ใช้ Map เก็บข้อมูล { count: จำนวนกิจกรรม, views: ยอดวิวรวม }
  const provinceMap = new Map<string, { count: number; views: number }>();

  for (const activity of activities) {
    const province = activity.location?.province;

    if (!province) {
      continue;
    }

    const currentData = provinceMap.get(province) || { count: 0, views: 0 };
    provinceMap.set(province, {
      count: currentData.count + 1,
      views: currentData.views + (activity.viewCount || 0),
    });
  }

  // แปลง Map เป็น Array แล้วเรียงลำดับจากกิจกรรมเยอะสุดไปน้อยสุด
  return Array.from(provinceMap.entries())
    .map(([province, data]) => ({
      province,
      count: data.count,
      viewCount: data.views,
    }))
    .sort((a, b) => b.count - a.count);
}

/*
 * คำอธิบาย :
 * ดึงข้อมูล Dashboard Activity สำหรับ Admin
 *
 * Input :
 * - query : ข้อมูลสำหรับกรอง Dashboard
 *
 * Output :
 * object ประกอบด้วย
 * - จำนวนกิจกรรมแยกตามประเภท
 * - จำนวนกิจกรรมแยกตามเดือน
 * - 10 อันดับกิจกรรมที่มี viewCount สูงสุด
 */
export async function getAdminDashboard(query: DashboardActivityQueryDto) {
  const [
    activityByType,
    activityByMonth,
    popularActivities,
    activityByProvince,
  ] = await Promise.all([
    getActivityByType(query),
    getActivityByMonth(query),
    getTop10Activities(query),
    getActivityByProvince(query),
  ]);

  return {
    filter: query,
    activityByType,
    activityByMonth,
    popularActivities,
    activityByProvince,
  };
}

/*
 * คำอธิบาย :
 * ดึงข้อมูล Dashboard Activity สำหรับ Super Admin
 *
 * Input :
 * - query : ข้อมูลสำหรับกรอง Dashboard
 *
 * Output :
 * object ประกอบด้วย
 * - จำนวนกิจกรรมแยกตามประเภท
 * - จำนวนกิจกรรมแยกตามเดือน
 * - 10 อันดับกิจกรรมที่มี viewCount สูงสุด
 * - จำนวนกิจกรรมแยกตามภาค
 * - จำนวนกิจกรรมแยกตามจังหวัด
 */
export async function getSuperAdminDashboard(query: DashboardActivityQueryDto) {
  const [
    activityByType,
    activityByMonth,
    popularActivities,
    activityByZone,
    activityByProvince,
  ] = await Promise.all([
    getActivityByType(query),
    getActivityByMonth(query),
    getTop10Activities(query),
    getActivityByZone(query),
    getActivityByProvince(query),
  ]);

  return {
    filter: query,
    activityByType,
    activityByMonth,
    popularActivities,
    activityByZone,
    activityByProvince,
  };
}