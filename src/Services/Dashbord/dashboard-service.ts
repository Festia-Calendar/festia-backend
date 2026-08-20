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
function buildActivityWhere(
  query: DashboardActivityQueryDto
) {
  const where: any = {
    statusActivity: "PUBLISH",
    isDeleted: false,
  };

  /*
   * กรองตามปี
   */
  if (query.year) {
    const startDate = new Date(query.year, 0, 1);
    const endDate = new Date(query.year + 1, 0, 1);

    where.startDate = {
      gte: startDate,
      lt: endDate,
    };

    /*
     * กรองตามเดือน
     */
    if (query.month) {
      const monthStart = new Date(
        query.year,
        query.month - 1,
        1
      );

      const monthEnd = new Date(
        query.year,
        query.month,
        1
      );

      where.startDate = {
        gte: monthStart,
        lt: monthEnd,
      };
    }
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
export async function getActivityByType(
  query: DashboardActivityQueryDto
) {
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
export async function getActivityByMonth(
  query: DashboardActivityQueryDto
) {
  const year =
    query.year ?? new Date().getFullYear();

  /*
   * ถ้ามีการเลือกเดือน
   * แสดงเฉพาะข้อมูลของเดือนนั้น
   */
  if (query.month) {
    const where = buildActivityWhere({
      ...query,
      year,
    });

    const count = await prisma.activity.count({
      where,
    });

    return [
      {
        month: query.month,
        count,
      },
    ];
  }

  /*
   * ถ้าไม่ได้เลือกเดือน
   * แสดงข้อมูลครบทั้ง 12 เดือน
   */
  const where = buildActivityWhere({
    ...query,
    year,
    month: undefined,
  });

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

    const month =
      activity.startDate.getMonth();

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
export async function getTop10Activities(
  query: DashboardActivityQueryDto
) {
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
export async function getActivityByZone(
  query: DashboardActivityQueryDto
) {
  /*
   * ไม่ใช้ zone ในการกรอง
   * เนื่องจากต้องการแสดงจำนวนของแต่ละภาค
   */
  const where = buildActivityWhere({
    ...query,
    zone: undefined,
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

  const zoneMap = new Map<
    string,
    number
  >();

  for (const activity of activities) {
    const zone = activity.location?.zone;

    if (!zone) {
      continue;
    }

    zoneMap.set(
      zone,
      (zoneMap.get(zone) ?? 0) + 1
    );
  }

  return Array.from(zoneMap.entries()).map(
    ([zone, count]) => ({
      zone,
      count,
    })
  );
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
export async function getActivityByProvince(
  query: DashboardActivityQueryDto
) {
  /*
   * ถ้าเลือกภาค
   * จะแสดงเฉพาะจังหวัดภายในภาคนั้น
   */
  const where = buildActivityWhere(query);

  const activities = await prisma.activity.findMany({
    where,
    select: {
      location: {
        select: {
          province: true,
        },
      },
    },
  });

  const provinceMap = new Map<
    string,
    number
  >();

  for (const activity of activities) {
    const province =
      activity.location?.province;

    if (!province) {
      continue;
    }

    provinceMap.set(
      province,
      (provinceMap.get(province) ?? 0) + 1
    );
  }

  return Array.from(
    provinceMap.entries()
  ).map(([province, count]) => ({
    province,
    count,
  }));
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
export async function getAdminDashboard(
  query: DashboardActivityQueryDto
) {
  const [
    activityByType,
    activityByMonth,
    popularActivities,
  ] = await Promise.all([
    getActivityByType(query),
    getActivityByMonth(query),
    getTop10Activities(query),
  ]);

  return {
    filter: query,
    activityByType,
    activityByMonth,
    popularActivities,
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
export async function getSuperAdminDashboard(
  query: DashboardActivityQueryDto
) {
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