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

  // =========================
  // ROLE
  // =========================

  const superAdminRole = await prisma.role.upsert({
    where: { name: "SUPERADMIN" },
    update: {},
    create: {
      name: "SUPERADMIN",
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: {
      name: "ADMIN",
    },
  });

  console.log("✅ Roles seeded");

  // =========================
  // BANNER
  // =========================

  await prisma.banner.deleteMany();

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

  console.log("✅ Banners seeded");

  // =========================
  // USERS
  // =========================

  const password = await bcrypt.hash("123456", 10);

  const superAdmin = await prisma.user.upsert({
    where: {
      username: "superadmin",
    },
    update: {},
    create: {
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

  const admin = await prisma.user.upsert({
    where: {
      username: "admin",
    },
    update: {},
    create: {
      roleId: adminRole.id,
      username: "admin",
      email: "admin@example.com",
      password,
      fname: "System",
      lname: "Admin",
      phone: "0800000002",
      gender: Gender.FEMALE,
      status: UserStatus.ACTIVE,
    },
  });

  const admin2 = await prisma.user.upsert({
    where: {
      username: "admin2",
    },
    update: {},
    create: {
      roleId: adminRole.id,
      username: "admin2",
      email: "admin2@example.com",
      password,
      fname: "Somchai",
      lname: "Jaidee",
      phone: "0800000003",
      gender: Gender.MALE,
      status: UserStatus.ACTIVE,
    },
  });

  const blockedUser = await prisma.user.upsert({
    where: {
      username: "blocked",
    },
    update: {},
    create: {
      roleId: adminRole.id,
      username: "blocked",
      email: "blocked@example.com",
      password,
      fname: "Blocked",
      lname: "User",
      phone: "0800000004",
      gender: Gender.NONE,
      status: UserStatus.BLOCKED,
    },
  });

  console.log("✅ Users seeded");

  // =========================
  // LOCATION
  // =========================

  await prisma.location.deleteMany();

  await prisma.location.createMany({
    data: [
      {
        name: "หาดพัทยา",
        zone: "ภาคตะวันออก",
        province: "ชลบุรี",
        district: "บางละมุง",
        subDistrict: "หนองปรือ",
        detail: "ชายหาดพัทยาเหนือ",
        latitude: 12.9342,
        longitude: 100.8830,
      },
      {
        name: "ตลาดน้ำ 4 ภาค",
        zone: "ภาคตะวันออก",
        province: "ชลบุรี",
        district: "บางละมุง",
        subDistrict: "หนองปรือ",
        detail: "ตลาดน้ำพัทยา",
        latitude: 12.8797,
        longitude: 100.9045,
      },
      {
        name: "เซ็นทรัล พัทยา",
        zone: "ภาคตะวันออก",
        province: "ชลบุรี",
        district: "บางละมุง",
        subDistrict: "หนองปรือ",
        detail: "Central Pattaya",
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
        detail: "อาคารประชุม",
        latitude: 12.9616,
        longitude: 100.8894,
      },
    ],
  });

  const locations = await prisma.location.findMany();

  console.log("✅ Locations seeded");

  // =========================
  // ACTIVITIES
  // =========================

  await prisma.activityScheduleFile.deleteMany();
  await prisma.activityFile.deleteMany();
  await prisma.activitySchedule.deleteMany();
  await prisma.activity.deleteMany();

  const activities = [
    {
      name: "เทศกาลสงกรานต์พัทยา",
      tagline: "เล่นน้ำสุดมันส์",
      description: "ร่วมสนุกเทศกาลสงกรานต์ริมชายหาด",
      activityType: ActivityType.CULTURAL_FESTIVAL,
      publish: ActivityPublishStatus.PUBLISH,
      approve: ActivityApproveStatus.APPROVE,
      price: 0,
      locationId: locations[0].id,
      createById: superAdmin.id,
    },
    {
      name: "นิทรรศการศิลปะร่วมสมัย",
      tagline: "Art Exhibition",
      description: "รวมผลงานศิลปินไทย",
      activityType: ActivityType.EXHIBITION_ART,
      publish: ActivityPublishStatus.PUBLISH,
      approve: ActivityApproveStatus.APPROVE,
      price: 100,
      locationId: locations[1].id,
      createById: admin.id,
    },
    {
      name: "คอนเสิร์ตริมทะเล",
      tagline: "Beach Music",
      description: "ดนตรีสดริมชายหาด",
      activityType: ActivityType.PERFORMANCE_MUSIC,
      publish: ActivityPublishStatus.PUBLISH,
      approve: ActivityApproveStatus.PENDING,
      price: 299,
      locationId: locations[2].id,
      createById: admin.id,
    },
    {
      name: "เทศกาลอาหารทะเล",
      tagline: "Seafood Festival",
      description: "อาหารทะเลสด",
      activityType: ActivityType.FOOD_DRINK_FESTIVAL,
      publish: ActivityPublishStatus.DRAFT,
      approve: ActivityApproveStatus.PENDING,
      price: 50,
      locationId: locations[3].id,
      createById: admin2.id,
    },
    {
      name: "ตลาดนัดกลางคืน",
      tagline: "Night Market",
      description: "ของกินและของใช้",
      activityType: ActivityType.MARKET_FAIR,
      publish: ActivityPublishStatus.UNPUBLISH,
      approve: ActivityApproveStatus.REJECTED,
      price: 0,
      locationId: locations[4].id,
      createById: admin2.id,
      rejectReason: "ข้อมูลไม่ครบ",
    },
    {
      name: "อบรม AI",
      tagline: "AI Training",
      description: "พื้นฐาน AI",
      activityType: ActivityType.TRAINING_SEMINAR,
      publish: ActivityPublishStatus.DRAFT,
      approve: ActivityApproveStatus.PENDING,
      price: 1500,
      locationId: locations[0].id,
      createById: superAdmin.id,
    },
    {
      name: "วิ่งมาราธอน",
      tagline: "Marathon",
      description: "กิจกรรมเพื่อสุขภาพ",
      activityType: ActivityType.SPORT_RECREATION,
      publish: ActivityPublishStatus.PUBLISH,
      approve: ActivityApproveStatus.APPROVE,
      price: 500,
      locationId: locations[1].id,
      createById: admin.id,
    },
    {
      name: "ท่องเที่ยวชุมชน",
      tagline: "Community Tour",
      description: "เยี่ยมชมวิถีชุมชน",
      activityType: ActivityType.COMMUNITY_TOURISM,
      publish: ActivityPublishStatus.UNPUBLISH,
      approve: ActivityApproveStatus.APPROVE,
      price: 250,
      locationId: locations[2].id,
      createById: admin2.id,
    },
    {
      name: "เทศกาลลอยกระทง",
      tagline: "Loy Krathong",
      description: "ลอยกระทงริมทะเล",
      activityType: ActivityType.CULTURAL_FESTIVAL,
      publish: ActivityPublishStatus.PUBLISH,
      approve: ActivityApproveStatus.APPROVE,
      price: 0,
      locationId: locations[3].id,
      createById: superAdmin.id,
    },
    {
      name: "มหกรรมอาหาร",
      tagline: "Food Fair",
      description: "รวมร้านดังทั่วประเทศ",
      activityType: ActivityType.FOOD_DRINK_FESTIVAL,
      publish: ActivityPublishStatus.DRAFT,
      approve: ActivityApproveStatus.REJECTED,
      price: 20,
      locationId: locations[4].id,
      createById: admin.id,
      rejectReason: "รูปภาพไม่ถูกต้อง",
    },
  ];

  const createdActivities = [];

  for (const item of activities) {
    const activity = await prisma.activity.create({
      data: {
        locationId: item.locationId,
        createById: item.createById,
        updatedById: item.createById,
        name: item.name,
        tagline: item.tagline,
        description: item.description,
        activityType: item.activityType,
        phone: "0812345678",
        lineUrl: "https://line.me/ti/p/example",
        facebookUrl: "https://facebook.com/example",
        price: item.price,
        statusActivity: item.publish,
        statusApprove: item.approve,
        rejectReason: item.rejectReason,
        startDate: new Date("2026-08-01T09:00:00"),
        dueDate: new Date("2026-08-01T18:00:00"),
        viewCount: Math.floor(Math.random() * 500),
      },
    });

    createdActivities.push(activity);
  }

  console.log("✅ Activities seeded");

  // =========================
  // ACTIVITY SCHEDULE + FILES
  // =========================

  for (const activity of createdActivities) {

    const schedules = [
      {
        title: "ลงทะเบียน",
        description: "ลงทะเบียนเข้าร่วมกิจกรรม",
        startDateTime: new Date("2026-08-01T08:30:00"),
        endDateTime: new Date("2026-08-01T09:00:00"),
      },
      {
        title: "เริ่มกิจกรรม",
        description: "เริ่มกิจกรรมหลัก",
        startDateTime: new Date("2026-08-01T09:00:00"),
        endDateTime: new Date("2026-08-01T12:00:00"),
      },
      {
        title: "พักกลางวัน",
        description: "รับประทานอาหารกลางวัน",
        startDateTime: new Date("2026-08-01T12:00:00"),
        endDateTime: new Date("2026-08-01T13:00:00"),
      },
      {
        title: "กิจกรรมช่วงบ่าย",
        description: "ดำเนินกิจกรรมต่อ",
        startDateTime: new Date("2026-08-01T13:00:00"),
        endDateTime: new Date("2026-08-01T16:30:00"),
      },
      {
        title: "ปิดงาน",
        description: "กล่าวปิดงาน",
        startDateTime: new Date("2026-08-01T16:30:00"),
        endDateTime: new Date("2026-08-01T17:00:00"),
      },
    ];


    for (const schedule of schedules) {

      const createdSchedule = await prisma.activitySchedule.create({
        data: {
          activityId: activity.id,
          ...schedule,
        },
      });


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
            filePath: `/uploads/activity/${activity.id}/schedule/${createdSchedule.id}/gallery-2.jpg`,
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

  }

  console.log("✅ Activity schedules + files seeded");

  // =========================
  // ACTIVITY FILES
  // =========================

  for (const activity of createdActivities) {
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

  console.log("✅ Activity files seeded");

  console.log("🎉 Seed completed successfully!");
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
