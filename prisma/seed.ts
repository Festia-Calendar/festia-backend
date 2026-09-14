import {
  PrismaClient,
  Gender,
  UserStatus,
  ActivityPublishStatus,
  ActivityApproveStatus,
  ActivityType,
  ImageType,
} from "@prisma/client";

import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Start seeding...");

  // =========================================================
  // CLEAN OLD DATA
  // =========================================================

  await prisma.activityScheduleFile.deleteMany();
  await prisma.activityFile.deleteMany();
  await prisma.activitySchedule.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.location.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  console.log("🧹 Old data cleared");

  // =========================================================
  // ROLES
  // =========================================================

  const superAdminRole = await prisma.role.create({
    data: {
      name: "SUPERADMIN",
    },
  });

  const adminRole = await prisma.role.create({
    data: {
      name: "ADMIN",
    },
  });

  console.log("✅ Roles seeded");

  // =========================================================
  // BANNERS
  // =========================================================

  await prisma.banner.createMany({
    data: [
      {
        image: "/uploads/banner/banner-1.jpg",
      },
      {
        image: "/uploads/banner/banner-2.jpg",
      },
      {
        image: "/uploads/banner/banner-3.jpg",
      },
    ],
  });

  console.log("✅ 3 Banners seeded");

  // =========================================================
  // USERS
  // =========================================================

  const password = await bcrypt.hash("123456", 10);

  const superAdmin = await prisma.user.create({
    data: {
      roleId: superAdminRole.id,
      username: "superadmin",
      email: "superadmin@example.com",
      password,
      fname: "Super",
      lname: "Admin",
      phone: "0800000001",
      gender: Gender.MALE,
      status: UserStatus.ACTIVE,
    },
  });

  const admin1 = await prisma.user.create({
    data: {
      roleId: adminRole.id,
      username: "admin",
      email: "admin@example.com",
      password,
      fname: "System",
      lname: "Admin",
      phone: "0800000002",
      gender: Gender.MALE,
      status: UserStatus.ACTIVE,
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      roleId: adminRole.id,
      username: "admin2",
      email: "admin2@example.com",
      password,
      fname: "Somchai",
      lname: "Jaidee",
      phone: "0800000003",
      gender: Gender.FEMALE,
      status: UserStatus.ACTIVE,
    },
  });

  console.log("✅ Users seeded");
  console.log("   - superadmin");
  console.log("   - admin");
  console.log("   - admin2");

  // =========================================================
  // LOCATIONS
  // 1 LOCATION / 1 ACTIVITY
  // =========================================================

  const locationData = [
    {
      name: "หาดพัทยา",
      zone: "ภาคตะวันออก",
      province: "ชลบุรี",
      district: "บางละมุง",
      subDistrict: "หนองปรือ",
      detail: "ชายหาดพัทยา",
      latitude: 12.9342,
      longitude: 100.883,
    },
    {
      name: "ตลาดน้ำ 4 ภาค",
      zone: "ภาคตะวันออก",
      province: "ชลบุรี",
      district: "บางละมุง",
      subDistrict: "หนองปรือ",
      detail: "ตลาดน้ำ 4 ภาค พัทยา",
      latitude: 12.8797,
      longitude: 100.9045,
    },
    {
      name: "เซ็นทรัล พัทยา",
      zone: "ภาคตะวันออก",
      province: "ชลบุรี",
      district: "บางละมุง",
      subDistrict: "หนองปรือ",
      detail: "ศูนย์การค้าเซ็นทรัล พัทยา",
      latitude: 12.9349,
      longitude: 100.8838,
    },
    {
      name: "สวนสาธารณะเฉลิมพระเกียรติ",
      zone: "ภาคตะวันออก",
      province: "ชลบุรี",
      district: "บางละมุง",
      subDistrict: "นาเกลือ",
      detail: "พื้นที่จัดกิจกรรมกลางแจ้ง",
      latitude: 12.9501,
      longitude: 100.8899,
    },
    {
      name: "ศาลาว่าการเมืองพัทยา",
      zone: "ภาคตะวันออก",
      province: "ชลบุรี",
      district: "บางละมุง",
      subDistrict: "นาเกลือ",
      detail: "อาคารประชุมเมืองพัทยา",
      latitude: 12.9616,
      longitude: 100.8894,
    },
    {
      name: "Walking Street Pattaya",
      zone: "ภาคตะวันออก",
      province: "ชลบุรี",
      district: "บางละมุง",
      subDistrict: "หนองปรือ",
      detail: "พื้นที่จัดกิจกรรมและการแสดง",
      latitude: 12.9276,
      longitude: 100.8696,
    },
    {
      name: "เขาพระใหญ่",
      zone: "ภาคตะวันออก",
      province: "ชลบุรี",
      district: "บางละมุง",
      subDistrict: "หนองปรือ",
      detail: "พื้นที่ท่องเที่ยวและกิจกรรม",
      latitude: 12.9157,
      longitude: 100.8698,
    },
    {
      name: "หาดจอมเทียน",
      zone: "ภาคตะวันออก",
      province: "ชลบุรี",
      district: "บางละมุง",
      subDistrict: "หนองปรือ",
      detail: "ชายหาดจอมเทียน",
      latitude: 12.8886,
      longitude: 100.875,
    },
    {
      name: "เมืองจำลองพัทยา",
      zone: "ภาคตะวันออก",
      province: "ชลบุรี",
      district: "บางละมุง",
      subDistrict: "นาเกลือ",
      detail: "สถานที่จัดกิจกรรมและนิทรรศการ",
      latitude: 12.965,
      longitude: 100.909,
    },
  ];

  const locations = [];

  for (const location of locationData) {
    const created = await prisma.location.create({
      data: location,
    });

    locations.push(created);
  }

  console.log("✅ 9 Locations seeded");

  // =========================================================
  // ACTIVITIES
  //
  // 9 ACTIVITIES
  // ครบทุก combination:
  //
  // PUBLISH   + APPROVE
  // PUBLISH   + PENDING
  // PUBLISH   + REJECTED
  //
  // UNPUBLISH + APPROVE
  // UNPUBLISH + PENDING
  // UNPUBLISH + REJECTED
  //
  // DRAFT     + APPROVE
  // DRAFT     + PENDING
  // DRAFT     + REJECTED
  // =========================================================

  const activities = [
    {
      name: "เทศกาลสงกรานต์พัทยา",
      tagline: "เทศกาลสงกรานต์ริมชายหาด",
      description: "ร่วมสนุกกับเทศกาลสงกรานต์และกิจกรรมทางวัฒนธรรม",
      type: ActivityType.CULTURAL_FESTIVAL,
      publish: ActivityPublishStatus.PUBLISH,
      approve: ActivityApproveStatus.APPROVE,
      price: 0,
    },
    {
      name: "นิทรรศการศิลปะร่วมสมัย",
      tagline: "รวมผลงานศิลปินไทย",
      description: "นิทรรศการศิลปะร่วมสมัยจากศิลปินไทย",
      type: ActivityType.EXHIBITION_ART,
      publish: ActivityPublishStatus.PUBLISH,
      approve: ActivityApproveStatus.PENDING,
      price: 100,
    },
    {
      name: "คอนเสิร์ตริมทะเล",
      tagline: "ดนตรีสดริมชายหาด",
      description: "คอนเสิร์ตและการแสดงดนตรีสดริมทะเล",
      type: ActivityType.PERFORMANCE_MUSIC,
      publish: ActivityPublishStatus.PUBLISH,
      approve: ActivityApproveStatus.REJECTED,
      price: 299,
      rejectReason: "รายละเอียดกิจกรรมยังไม่ครบถ้วน",
    },

    {
      name: "เทศกาลอาหารทะเล",
      tagline: "รวมอาหารทะเลสด",
      description: "เทศกาลอาหารทะเลและอาหารท้องถิ่น",
      type: ActivityType.FOOD_DRINK_FESTIVAL,
      publish: ActivityPublishStatus.UNPUBLISH,
      approve: ActivityApproveStatus.APPROVE,
      price: 50,
    },
    {
      name: "ตลาดนัดกลางคืน",
      tagline: "ช้อป กิน เที่ยว",
      description: "ตลาดนัดกลางคืนรวมอาหารและสินค้าท้องถิ่น",
      type: ActivityType.MARKET_FAIR,
      publish: ActivityPublishStatus.UNPUBLISH,
      approve: ActivityApproveStatus.PENDING,
      price: 0,
    },
    {
      name: "มหกรรมกีฬาเมืองพัทยา",
      tagline: "รวมกิจกรรมกีฬา",
      description: "กิจกรรมการแข่งขันกีฬาและนันทนาการ",
      type: ActivityType.SPORT_RECREATION,
      publish: ActivityPublishStatus.UNPUBLISH,
      approve: ActivityApproveStatus.REJECTED,
      price: 200,
      rejectReason: "เอกสารประกอบกิจกรรมไม่ครบ",
    },

    {
      name: "อบรม AI สำหรับผู้เริ่มต้น",
      tagline: "เรียนรู้ AI เบื้องต้น",
      description: "อบรมความรู้พื้นฐานด้าน AI สำหรับผู้เริ่มต้น",
      type: ActivityType.TRAINING_SEMINAR,
      publish: ActivityPublishStatus.DRAFT,
      approve: ActivityApproveStatus.APPROVE,
      price: 1500,
    },
    {
      name: "ท่องเที่ยวชุมชนพัทยา",
      tagline: "สัมผัสวิถีชุมชน",
      description: "เรียนรู้วัฒนธรรมและวิถีชีวิตของชุมชน",
      type: ActivityType.COMMUNITY_TOURISM,
      publish: ActivityPublishStatus.DRAFT,
      approve: ActivityApproveStatus.PENDING,
      price: 250,
    },
    {
      name: "เทศกาลลอยกระทง",
      tagline: "สืบสานประเพณีไทย",
      description: "กิจกรรมลอยกระทงและการแสดงทางวัฒนธรรม",
      type: ActivityType.CULTURAL_FESTIVAL,
      publish: ActivityPublishStatus.DRAFT,
      approve: ActivityApproveStatus.REJECTED,
      price: 0,
      rejectReason: "ข้อมูลกิจกรรมไม่ผ่านการตรวจสอบ",
    },
  ];

  const createdActivities = [];

  for (let i = 0; i < activities.length; i++) {
    const item = activities[i];

    const startDate = new Date(`2026-10-${String(i + 1).padStart(2, "0")}T09:00:00`);
    const dueDate = new Date(`2026-10-${String(i + 1).padStart(2, "0")}T18:00:00`);

    const activity = await prisma.activity.create({
      data: {
        locationId: locations[i].id,

        // ADMIN คนแรกเป็นคนสร้างทั้งหมด
        createById: admin1.id,
        updatedById: admin1.id,

        name: item.name,
        tagline: item.tagline,
        description: item.description,

        activityType: item.type,

        phone: "0812345678",
        lineUrl: "https://line.me/",
        facebookUrl: "https://facebook.com/",

        price: item.price,

        statusActivity: item.publish,
        statusApprove: item.approve,

        rejectReason: item.rejectReason ?? null,

        startDate,
        dueDate,

        viewCount: (i + 1) * 100,
      },
    });

    createdActivities.push(activity);
  }

  console.log("✅ 9 Activities seeded");

  // =========================================================
  // ACTIVITY SCHEDULE
  // 3 SCHEDULE / 1 ACTIVITY
  // =========================================================

  for (const activity of createdActivities) {
    const date = activity.startDate ?? new Date("2026-10-01");

    const schedules = [
      {
        title: "ลงทะเบียน",
        description: "ลงทะเบียนและรับเอกสาร",
        startDateTime: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          8,
          30
        ),
        endDateTime: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          9,
          0
        ),
      },
      {
        title: "เริ่มกิจกรรม",
        description: "เริ่มกิจกรรมหลัก",
        startDateTime: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          9,
          0
        ),
        endDateTime: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          12,
          0
        ),
      },
      {
        title: "กิจกรรมช่วงบ่าย",
        description: "ดำเนินกิจกรรมช่วงบ่าย",
        startDateTime: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          13,
          0
        ),
        endDateTime: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          17,
          0
        ),
      },
    ];

    for (const schedule of schedules) {
      const createdSchedule = await prisma.activitySchedule.create({
        data: {
          activityId: activity.id,
          ...schedule,
        },
      });

      // =====================================================
      // SCHEDULE FILES
      // =====================================================

      await prisma.activityScheduleFile.createMany({
        data: [
          {
            scheduleId: createdSchedule.id,
            filePath: `/uploads/activity/${activity.id}/schedule/${createdSchedule.id}/cover.jpg`,
            type: ImageType.COVER,
          },
          {
            scheduleId: createdSchedule.id,
            filePath: `/uploads/activity/${activity.id}/schedule/${createdSchedule.id}/gallery-1.jpg`,
            type: ImageType.GALLERY,
          },
          {
            scheduleId: createdSchedule.id,
            filePath: `/uploads/activity/${activity.id}/schedule/${createdSchedule.id}/video.mp4`,
            type: ImageType.VIDEO,
          },
        ],
      });
    }

    // =====================================================
    // ACTIVITY FILES
    // =====================================================

    await prisma.activityFile.createMany({
      data: [
        {
          activityId: activity.id,
          filePath: `/uploads/activity/${activity.id}/cover.jpg`,
          type: ImageType.COVER,
        },
        {
          activityId: activity.id,
          filePath: `/uploads/activity/${activity.id}/gallery-1.jpg`,
          type: ImageType.GALLERY,
        },
        {
          activityId: activity.id,
          filePath: `/uploads/activity/${activity.id}/gallery-2.jpg`,
          type: ImageType.GALLERY,
        },
        {
          activityId: activity.id,
          filePath: `/uploads/activity/${activity.id}/video.mp4`,
          type: ImageType.VIDEO,
        },
      ],
    });
  }

  console.log("✅ 27 Schedules seeded");
  console.log("✅ Activity files seeded");

  // =========================================================
  // SUMMARY
  // =========================================================

  console.log("");
  console.log("========================================");
  console.log("🎉 SEED COMPLETED SUCCESSFULLY");
  console.log("========================================");
  console.log("SUPERADMIN : 1");
  console.log("ADMIN      : 2");
  console.log("BANNER     : 3");
  console.log("LOCATION   : 9");
  console.log("ACTIVITY   : 9");
  console.log("SCHEDULE   : 27");
  console.log("");
  console.log("Login:");
  console.log("superadmin / 123456");
  console.log("admin      / 123456");
  console.log("admin2     / 123456");
  console.log("========================================");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });