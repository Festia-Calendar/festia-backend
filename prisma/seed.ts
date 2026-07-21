
import { PrismaClient, Gender, UserStatus, ActivityPublishStatus, ActivityApproveStatus,  } from "@prisma/client";

import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {

  // ======================
  // Role
  // ======================
  const superAdminRole = await prisma.role.upsert({
    where: {
      name: "SUPERADMIN",
    },
    update: {},
    create: {
      name: "SUPERADMIN",
    },
  });

  const adminRole = await prisma.role.upsert({
    where: {
      name: "ADMIN",
    },
    update: {},
    create: {
      name: "ADMIN",
    },
  });


  // ======================
  // User
  // ======================
  const password = await bcrypt.hash("123456", 10);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@festia.com",
    },
    update: {},
    create: {
      roleId: superAdminRole.id,
      username: "admin",
      email: "admin@festia.com",
      password,
      fname: "Admin",
      lname: "Festia",
      phone: "0812345678",
      gender: Gender.MALE,
      status: UserStatus.ACTIVE,
    },
  });


  // ======================
  // Location
  // ======================
  const location = await prisma.location.create({
    data: {
      name: "ศูนย์ประชุมแห่งชาติ",
      zone: "กรุงเทพ",
      province: "กรุงเทพมหานคร",
      district: "คลองเตย",
      subDistrict: "คลองเตย",
      detail: "สถานที่จัดงานตัวอย่าง",
      latitude: 13.7245,
      longitude: 100.5595,
    },
  });


  // ======================
  // Activity
  // ======================
  const activity = await prisma.activity.create({
    data: {
      locationId: location.id,
      createById: admin.id,

      name: "เทศกาลดนตรี Festia",
      tagline: "Music Festival 2026",
      description: "กิจกรรมดนตรีและความบันเทิง",

      price: 500,

      statusActivity: ActivityPublishStatus.PUBLISH,
      statusApprove: ActivityApproveStatus.APPROVE,

      startDate: new Date("2026-01-10"),
      dueDate: new Date("2026-01-12"),

      createdAt: new Date(),
      updatedById: admin.id,
    },
  });


  // ======================
  // Activity Schedule
  // ======================
  await prisma.activitySchedule.createMany({
    data: [
      {
        activityId: activity.id,
        title: "ลงทะเบียนเข้างาน",
        description: "ผู้เข้าร่วมลงทะเบียน",
        startDateTime: new Date("2026-01-10T09:00:00"),
        endDateTime: new Date("2026-01-10T10:00:00"),
      },
      {
        activityId: activity.id,
        title: "พิธีเปิดงาน",
        description: "เปิดงานเทศกาล",
        startDateTime: new Date("2026-01-10T10:00:00"),
        endDateTime: new Date("2026-01-10T11:00:00"),
      },
      {
        activityId: activity.id,
        title: "คอนเสิร์ต",
        description: "การแสดงดนตรี",
        startDateTime: new Date("2026-01-10T18:00:00"),
        endDateTime: new Date("2026-01-10T22:00:00"),
      },
    ],
  });


  console.log("Seed completed");
}


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });