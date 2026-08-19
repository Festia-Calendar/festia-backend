/*
 * คำอธิบาย :
 * Service สำหรับจัดการข้อมูล Activity
 * ใช้ Prisma ORM ในการติดต่อฐานข้อมูล
*/
import prisma from "../database-service.js";
import "reflect-metadata";
import {
  ActivityApproveStatus,
  ActivityPublishStatus,
  ActivityType,
  ImageType,
} from "@prisma/client";

import {
  PaginationDto,
  PaginationResponse,
} from "../pagination-dto.js";

import { ActivityDto, ActivityQueryDto, UpdateActivityDto, } from "../Activity/activity-dto.js";


/**
 * คำอธิบาย : (SuperAdmin) ดึงรายการ Activity ทั้งหมด
 * รองรับ Pagination และ Search
 *
 * Input:
 * - query.page   : หมายเลขหน้าที่ต้องการ
 * - query.limit  : จำนวนรายการต่อหน้า
 * - query.search : คำค้นหา
 *
 * Search รองรับ:
 * - ชื่อกิจกรรม
 * - ประเภทกิจกรรม
 * - ภูมิภาค
 * - จังหวัด
 * - อำเภอ
 * - ตำบล
 * - วันที่เริ่มกิจกรรม
 * - วันที่สิ้นสุดกิจกรรม
 *
 * Output:
 * - รายการ Activity
 * - ข้อมูล Pagination ได้แก่ หน้าปัจจุบัน จำนวนหน้าทั้งหมด
 *   จำนวนข้อมูลทั้งหมด และจำนวนรายการต่อหน้า
 */
export const getActivityBySuperAdmin = async (
  query: PaginationDto
): Promise<PaginationResponse<any>> => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const skip = (page - 1) * limit;

  const search = query.search?.trim();

  const where: any = {
    isDeleted: false,
  };

  if (search) {
    where.name = {
      contains: search,
    };
  }

  if (query.activityType) {
    where.activityType = query.activityType;
  }

  if (
    query.zone ||
    query.province ||
    query.district ||
    query.subDistrict
  ) {
    where.location = {};

    if (query.zone) {
      where.location.zone = query.zone;
    }

    if (query.province) {
      where.location.province = query.province;
    }

    if (query.district) {
      where.location.district = query.district;
    }

    if (query.subDistrict) {
      where.location.subDistrict = query.subDistrict;
    }
  }

  // วันที่เริ่ม
  if (query.startDate) {
    const startDate = new Date(`${query.startDate}T00:00:00`);
    const nextDate = new Date(startDate);
    nextDate.setDate(nextDate.getDate() + 1);

    where.startDate = {
      gte: startDate,
      lt: nextDate,
    };
  }

  // วันที่สิ้นสุด
  if (query.dueDate) {
    const dueDate = new Date(`${query.dueDate}T00:00:00`);
    const nextDate = new Date(dueDate);
    nextDate.setDate(nextDate.getDate() + 1);

    where.dueDate = {
      gte: dueDate,
      lt: nextDate,
    };
  }

  const [data, totalCount] = await prisma.$transaction([
    prisma.activity.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        activityType: true,
        statusActivity: true,
        statusApprove: true,

        location: {
          select: {
            name: true,
            zone: true,
            province: true,
            district: true,
            subDistrict: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.activity.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
    },
  };
};
/**
 * คำอธิบาย : (Admin) ดึงรายการ Activity ที่สร้างโดย Admin
 * รองรับ Pagination และ Search
 *
 * Input:
 * - userId       : ID ของ Admin ที่ Login
 * - query.page   : หมายเลขหน้าที่ต้องการ
 * - query.limit  : จำนวนรายการต่อหน้า
 * - query.search : คำค้นหา
 *
 * Search รองรับ:
 * - ชื่อกิจกรรม
 * - ประเภทกิจกรรม
 * - ภูมิภาค
 * - จังหวัด
 * - อำเภอ
 * - ตำบล
 * - วันที่เริ่มกิจกรรม
 * - วันที่สิ้นสุดกิจกรรม
 *
 * Output:
 * - รายการ Activity ที่สร้างโดย Admin
 * - ข้อมูล Pagination ได้แก่ หน้าปัจจุบัน จำนวนหน้าทั้งหมด
 *   จำนวนข้อมูลทั้งหมด และจำนวนรายการต่อหน้า
 */
export const getActivityByAdmin = async (
  userId: number,
  query: PaginationDto
): Promise<PaginationResponse<any>> => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const skip = (page - 1) * limit;

  const where: any = {
    isDeleted: false,
    createById: userId,
  };
  // Search ชื่อกิจกรรม
  if (query.search?.trim()) {
    where.name = {
      contains: query.search.trim(),
    };
  }
  // Filter ประเภทกิจกรรม
  if (query.activityType) {
    where.activityType = query.activityType;
  }
  // Filter สถานที่
  if (
    query.zone ||
    query.province ||
    query.district ||
    query.subDistrict
  ) {
    where.location = {};

    if (query.zone) {
      where.location.zone = query.zone;
    }

    if (query.province) {
      where.location.province = query.province;
    }

    if (query.district) {
      where.location.district = query.district;
    }

    if (query.subDistrict) {
      where.location.subDistrict = query.subDistrict;
    }
  }
  // Filter วันที่เริ่มกิจกรรม
  if (query.startDate) {
    const startDate = new Date(`${query.startDate}T00:00:00`);
    const nextDate = new Date(startDate);

    nextDate.setDate(nextDate.getDate() + 1);

    where.startDate = {
      gte: startDate,
      lt: nextDate,
    };
  }
  // Filter วันที่สิ้นสุดกิจกรรม
  if (query.dueDate) {
    const dueDate = new Date(`${query.dueDate}T00:00:00`);
    const nextDate = new Date(dueDate);

    nextDate.setDate(nextDate.getDate() + 1);

    where.dueDate = {
      gte: dueDate,
      lt: nextDate,
    };
  }
  const [data, totalCount] = await prisma.$transaction([
    prisma.activity.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        activityType: true,
        statusActivity: true,
        statusApprove: true,

        location: {
          select: {
            name: true,
            zone: true,
            province: true,
            district: true,
            subDistrict: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.activity.count({
      where,
    }),
  ]);
  const totalPages = Math.ceil(totalCount / limit);
  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
    },
  };
};

/*
 * คำอธิบาย : Admin ดูรายละเอียดกิจกรรมของตัวเอง
 * Input : id - รหัสกิจกรรม, userId - ผู้สร้างกิจกรรม
 * Output : ข้อมูลกิจกรรม พร้อม location, files, schedules และผู้สร้าง/แก้ไข
 */
export const getActivityDetailByAdmin = async (
  id: number,
  userId: number
) => {
  return await prisma.activity.findFirst({
    where: {
      id,
      isDeleted: false,
      createById: userId,
    },
    include: {
      location: true,
      activityFile: true,
      schedules: {
        orderBy: {
          startDateTime: "asc",
        },
        include: {
          files: true
        }
      },
      createdBy: {
        select: {
          id: true,
          username: true,
          fname: true,
          lname: true,
          email: true,
        },
      },
      updatedBy: {
        select: {
          id: true,
          username: true,
          fname: true,
          lname: true,
          email: true,
        },
      },
    },
  });
};

/*
 * คำอธิบาย : SuperAdmin ดูรายละเอียดกิจกรรม
 * Input : id - รหัสกิจกรรม
 * Output : ข้อมูลกิจกรรม พร้อม location, files, schedules และผู้สร้าง/แก้ไข
 */
export const getActivityDetailBySuperadmin = async (
  id: number
) => {
  return await prisma.activity.findFirst({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      location: true,
      activityFile: true,
      schedules: {
        orderBy: {
          startDateTime: "asc",
        },
        include: {
          files: true
        }
      },
      createdBy: {
        select: {
          id: true,
          username: true,
          fname: true,
          lname: true,
          email: true,
        },
      },
      updatedBy: {
        select: {
          id: true,
          username: true,
          fname: true,
          lname: true,
          email: true,
        },
      },
    },
  });
};

/**
 * คำอธิบาย : (SuperAdmin) สร้างกิจกรรมใหม่
 *
 * Input:
 * - activityData : ข้อมูลกิจกรรมที่ผ่านการตรวจสอบด้วย ActivityDto
 * - files        : ไฟล์รูปปก รูป/วิดีโอเพิ่มเติม และไฟล์กำหนดการ
 * - userId       : ID ของ SuperAdmin ผู้สร้างกิจกรรม
 *
 * Output:
 * - ข้อมูลกิจกรรมที่สร้างสำเร็จ
 * - Location
 * - Activity files
 * - Schedules และไฟล์ของแต่ละ Schedule
 * - ข้อมูลผู้สร้าง
 */
export async function createActivityBySuperAdmin(
  activityData: ActivityDto,
  files: Record<string, Express.Multer.File[]>,
  userId: number
) {
  const cover = files.cover?.[0];
  const media = files.media ?? [];
  const scheduleFiles = files.scheduleFiles ?? [];

  return await prisma.$transaction(async (tx) => {
    const activity = await tx.activity.create({
      data: {
        createdBy: {
          connect: {
            id: userId,
          },
        },

        location: {
          create: {
            name: activityData.location.name,
            zone: activityData.location.zone,
            province: activityData.location.province,
            district: activityData.location.district,
            subDistrict: activityData.location.subDistrict,
            detail: activityData.location.detail,
            latitude: activityData.location.latitude,
            longitude: activityData.location.longitude,
          },
        },

        name: activityData.name,
        tagline: activityData.tagline,
        description: activityData.description,
        activityType: activityData.activityType,
        phone: activityData.phone,
        lineUrl: activityData.lineUrl,
        facebookUrl: activityData.facebookUrl,
        price: activityData.price,
        statusActivity: activityData.statusActivity,
        statusApprove: ActivityApproveStatus.APPROVE,
        startDate: new Date(activityData.startDate),
        dueDate: new Date(activityData.dueDate),
      },
    });
    /* บันทึกรูปปก */
    if (cover) {
      await tx.activityFile.create({
        data: {
          activityId: activity.id,
          filePath: cover.filename,
          type: ImageType.COVER,
        },
      });
    }
    /* บันทึกรูปและวิดีโอเพิ่มเติม */
    for (const file of media) {
      const extension = file.originalname
        .split(".")
        .pop()
        ?.toLowerCase();
      await tx.activityFile.create({
        data: {
          activityId: activity.id,
          filePath: file.filename,
          type:
            extension === "mp4" ||
              extension === "mov" ||
              extension === "m4v" ||
              extension === "webm"
              ? ImageType.VIDEO
              : ImageType.GALLERY,
        },
      });
    }
    /* สร้างกำหนดการกิจกรรม */
    for (const schedule of activityData.schedules) {
      const createdSchedule = await tx.activitySchedule.create({
        data: {
          activity: {
            connect: {
              id: activity.id,
            },
          },
          title: schedule.title,
          description: schedule.description,
          startDateTime: new Date(schedule.startDateTime),
          endDateTime: new Date(schedule.endDateTime),
        },
      });
      /* บันทึกรูปของกำหนดการ */
      if (Array.isArray(schedule.fileIndexes)) {
        for (const index of schedule.fileIndexes) {
          const file = scheduleFiles[index];
          if (!file) {
            continue;
          }
          await tx.activityScheduleFile.create({
            data: {
              schedule: {
                connect: {
                  id: createdSchedule.id,
                },
              },
              filePath: file.filename,
              type: ImageType.GALLERY,
            },
          });
        }
      }
    }
    return await tx.activity.findUnique({
      where: {
        id: activity.id,
      },
      include: {
        location: true,
        activityFile: true,
        schedules: {
          include: {
            files: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            fname: true,
            lname: true,
            email: true,
          },
        },
      },
    });
  });
}

/**
 * คำอธิบาย : Admin สร้างกิจกรรมใหม่
 *
 * Input:
 * - activityData : ข้อมูลกิจกรรมที่ผ่านการตรวจสอบด้วย ActivityDto
 * - files         : ไฟล์รูปปก รูป/วิดีโอเพิ่มเติม และไฟล์กำหนดการ
 * - userId        : ID ของ Admin ผู้สร้างกิจกรรม
 *
 * Output:
 * - ข้อมูลกิจกรรมที่สร้างสำเร็จ
 * - Location
 * - Activity files
 * - Schedules และไฟล์ของแต่ละ Schedule
 * - ข้อมูลผู้สร้าง
 *
 * หมายเหตุ:
 * - กิจกรรมที่สร้างโดย Admin จะมีสถานะการอนุมัติเป็น PENDING
 */
export async function createActivityByAdmin(
  activityData: ActivityDto,
  files: Record<string, Express.Multer.File[]>,
  userId: number
) {
  const cover = files.cover?.[0];
  const media = files.media ?? [];
  const scheduleFiles = files.scheduleFiles ?? [];

  return await prisma.$transaction(async (tx) => {
    const activity = await tx.activity.create({
      data: {
        createdBy: {
          connect: {
            id: userId,
          },
        },

        location: {
          create: {
            name: activityData.location.name,
            zone: activityData.location.zone,
            province: activityData.location.province,
            district: activityData.location.district,
            subDistrict: activityData.location.subDistrict,
            detail: activityData.location.detail,
            latitude: activityData.location.latitude,
            longitude: activityData.location.longitude,
          },
        },

        name: activityData.name,
        tagline: activityData.tagline,
        description: activityData.description,
        activityType: activityData.activityType,
        phone: activityData.phone,
        lineUrl: activityData.lineUrl,
        facebookUrl: activityData.facebookUrl,
        price: activityData.price,
        statusActivity: activityData.statusActivity,
        statusApprove: ActivityApproveStatus.PENDING,
        startDate: new Date(activityData.startDate),
        dueDate: new Date(activityData.dueDate),
      },
    });
    /* บันทึกรูปปก */
    if (cover) {
      await tx.activityFile.create({
        data: {
          activityId: activity.id,
          filePath: cover.filename,
          type: ImageType.COVER,
        },
      });
    }
    /* บันทึกรูปและวิดีโอเพิ่มเติม */
    for (const file of media) {
      const extension = file.originalname
        .split(".")
        .pop()
        ?.toLowerCase();
      await tx.activityFile.create({
        data: {
          activityId: activity.id,
          filePath: file.filename,
          type:
            extension === "mp4" ||
              extension === "mov" ||
              extension === "m4v" ||
              extension === "webm"
              ? ImageType.VIDEO
              : ImageType.GALLERY,
        },
      });
    }
    /* สร้างกำหนดการกิจกรรม */
    for (const schedule of activityData.schedules) {
      const createdSchedule = await tx.activitySchedule.create({
        data: {
          activity: {
            connect: {
              id: activity.id,
            },
          },
          title: schedule.title,
          description: schedule.description,
          startDateTime: new Date(schedule.startDateTime),
          endDateTime: new Date(schedule.endDateTime),
        },
      });
      /* บันทึกรูปของกำหนดการ */
      if (Array.isArray(schedule.fileIndexes)) {
        for (const index of schedule.fileIndexes) {
          const file = scheduleFiles[index];
          if (!file) {
            continue;
          }
          await tx.activityScheduleFile.create({
            data: {
              schedule: {
                connect: {
                  id: createdSchedule.id,
                },
              },
              filePath: file.filename,
              type: ImageType.GALLERY,
            },
          });
        }
      }
    }
    return await tx.activity.findUnique({
      where: {
        id: activity.id,
      },
      include: {
        location: true,
        activityFile: true,
        schedules: {
          include: {
            files: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            fname: true,
            lname: true,
            email: true,
          },
        },
      },
    });
  });
}


export const deleteActivityBySuperAdmin = async (
  activityId: number
) => {
  const activity =
    await prisma.activity.findUnique({
      where: {
        id: activityId
      }
    });

  if (!activity) {
    throw new Error(
      "ไม่พบกิจกรรมในระบบ"
    );
  }

  return prisma.activity.update({
    where: {
      id: activityId
    },
    data: {
      isDeleted: true,
      deleteAt: new Date()
    }
  });
};

/*
 * คำอธิบาย : ลบกิจกรรมโดย Admin (Soft Delete)
 * Input : activityId - รหัสกิจกรรม, userId - เจ้าของกิจกรรม
 * Output : ข้อมูลกิจกรรมที่ถูกลบ
 */
export const deleteActivityByAdmin = async (
  activityId: number,
  userId: number
) => {
  const activity =
    await prisma.activity.findFirst({
      where: {
        id: activityId,
        createById: userId,
        isDeleted: false
      }
    });
  if (!activity) {
    throw new Error(
      "ไม่พบกิจกรรม หรือไม่มีสิทธิ์ลบ"
    );
  }
  return prisma.activity.update({
    where: {
      id: activityId
    },
    data: {
      isDeleted: true,
      deleteAt: new Date()
    }
  });
};

/**
 * คำอธิบาย : แก้ไขกิจกรรมของ Admin
 * Input : activityId - รหัสกิจกรรม, activityData - ข้อมูลที่ต้องการแก้ไข,
 *         files - ไฟล์ที่อัปโหลด, userId - ผู้แก้ไข
 * Output : ข้อมูลกิจกรรมที่แก้ไขสำเร็จ พร้อม location, files, schedules,
 *          ผู้สร้าง และผู้แก้ไข
 */
export async function updateActivityByAdmin(
  activityId: number,
  activityData: UpdateActivityDto,
  files: Record<string, Express.Multer.File[]>,
  userId: number
) {
  const cover = files.cover?.[0];
  const media = files.media ?? [];
  const scheduleFiles = files.scheduleFiles ?? [];

  return await prisma.$transaction(async (tx) => {
    const activity = await tx.activity.findFirst({
      where: {
        id: activityId,
        isDeleted: false,
        createById: userId,
      },
      include: {
        location: true,
        activityFile: true,
        schedules: {
          include: {
            files: true,
          },
        },
      },
    });

    if (!activity) {
      throw new Error("Activity not found");
    }
    if (activity.locationId && activityData.location) {
      await tx.location.update({
        where: {
          id: activity.locationId,
        },
        data: {
          name: activityData.location.name,
          zone: activityData.location.zone,
          province: activityData.location.province,
          district: activityData.location.district,
          subDistrict: activityData.location.subDistrict,
          detail: activityData.location.detail,
          latitude: activityData.location.latitude,
          longitude: activityData.location.longitude,
        },
      });
    }

    await tx.activity.update({
      where: {
        id: activityId,
      },
      data: {
        ...(activityData.name !== undefined && {
          name: activityData.name,
        }),

        ...(activityData.tagline !== undefined && {
          tagline: activityData.tagline,
        }),

        ...(activityData.description !== undefined && {
          description: activityData.description,
        }),

        ...(activityData.activityType !== undefined && {
          activityType: activityData.activityType,
        }),

        ...(activityData.phone !== undefined && {
          phone: activityData.phone,
        }),

        ...(activityData.lineUrl !== undefined && {
          lineUrl: activityData.lineUrl,
        }),

        ...(activityData.facebookUrl !== undefined && {
          facebookUrl: activityData.facebookUrl,
        }),

        ...(activityData.price !== undefined && {
          price: activityData.price,
        }),

        ...(activityData.statusActivity !== undefined && {
          statusActivity: activityData.statusActivity,
        }),
        statusApprove: ActivityApproveStatus.PENDING,

        ...(activityData.startDate !== undefined && {
          startDate: new Date(activityData.startDate),
        }),

        ...(activityData.dueDate !== undefined && {
          dueDate: new Date(activityData.dueDate),
        }),

        updatedBy: {
          connect: {
            id: userId,
          },
        },
      },
    });
    if (cover) {
      await tx.activityFile.deleteMany({
        where: {
          activityId: activityId,
          type: ImageType.COVER,
        },
      });
      await tx.activityFile.create({
        data: {
          activityId: activityId,
          filePath: cover.filename,
          type: ImageType.COVER,
        },
      });
    }
    if (
      Array.isArray(activityData.mediaDeleteIds) &&
      activityData.mediaDeleteIds.length > 0
    ) {
      await tx.activityFile.deleteMany({
        where: {
          id: {
            in: activityData.mediaDeleteIds,
          },
          activityId: activityId,
          type: {
            in: [ImageType.GALLERY, ImageType.VIDEO],
          },
        },
      });
    }
    for (const file of media) {
      const extension = file.originalname
        .split(".")
        .pop()
        ?.toLowerCase();

      await tx.activityFile.create({
        data: {
          activityId: activityId,
          filePath: file.filename,
          type:
            extension === "mp4" ||
              extension === "mov" ||
              extension === "m4v" ||
              extension === "webm"
              ? ImageType.VIDEO
              : ImageType.GALLERY,
        },
      });
    }
    if (Array.isArray(activityData.schedules)) {
      if (
        Array.isArray(activityData.scheduleDeleteIds) &&
        activityData.scheduleDeleteIds.length > 0
      ) {
        await tx.activitySchedule.deleteMany({
          where: {
            id: {
              in: activityData.scheduleDeleteIds,
            },
            activityId: activityId,
          },
        });
      }
      for (const schedule of activityData.schedules) {
        let scheduleId: number;
        if (schedule.id) {
          const existingSchedule =
            await tx.activitySchedule.findFirst({
              where: {
                id: schedule.id,
                activityId: activityId,
              },
            });

          if (!existingSchedule) {
            throw new Error("Activity schedule not found");
          }

          const updatedSchedule =
            await tx.activitySchedule.update({
              where: {
                id: schedule.id,
              },
              data: {
                ...(schedule.title !== undefined && {
                  title: schedule.title,
                }),

                ...(schedule.description !== undefined && {
                  description: schedule.description,
                }),

                startDateTime: new Date(schedule.startDateTime),
                endDateTime: new Date(schedule.endDateTime),
              },
            });
          scheduleId = updatedSchedule.id;
          if (
            Array.isArray(schedule.deleteFileIds) &&
            schedule.deleteFileIds.length > 0
          ) {
            await tx.activityScheduleFile.deleteMany({
              where: {
                id: {
                  in: schedule.deleteFileIds,
                },
                scheduleId: scheduleId,
              },
            });
          }
        } else {
          const createdSchedule =
            await tx.activitySchedule.create({
              data: {
                activityId: activityId,
                title: schedule.title,
                description: schedule.description,
                startDateTime: new Date(schedule.startDateTime),
                endDateTime: new Date(schedule.endDateTime),
              },
            });

          scheduleId = createdSchedule.id;
        }
        if (Array.isArray(schedule.fileIndexes)) {
          for (const index of schedule.fileIndexes) {
            const file = scheduleFiles[index];

            if (!file) {
              continue;
            }
            await tx.activityScheduleFile.create({
              data: {
                scheduleId: scheduleId,
                filePath: file.filename,
                type: ImageType.GALLERY,
              },
            });
          }
        }
      }
    }
    return await tx.activity.findUnique({
      where: {
        id: activityId,
      },
      include: {
        location: true,

        createdBy: {
          select: {
            id: true,
            fname: true,
            lname: true,
            email: true,
          },
        },
        updatedBy: {
          select: {
            id: true,
            fname: true,
            lname: true,
            email: true,
          },
        },
        activityFile: true,
        schedules: {
          orderBy: {
            startDateTime: "asc",
          },
          include: {
            files: true,
          },
        },
      },
    });
  });
}

/**
 * คำอธิบาย : แก้ไขกิจกรรมโดย SuperAdmin
 * Input : activityId - รหัสกิจกรรม,
 *         activityData - ข้อมูลใหม่,
 *         files - ไฟล์ที่อัปโหลด,
 *         userId - ผู้แก้ไข
 * Output : ข้อมูลกิจกรรมที่แก้ไขแล้ว
 */
export async function updateActivityBySuperAdmin(
  activityId: number,
  activityData: UpdateActivityDto,
  files: Record<string, Express.Multer.File[]>,
  userId: number
) {
  const cover = files.cover?.[0];
  const media = files.media ?? [];
  const scheduleFiles = files.scheduleFiles ?? [];

  return await prisma.$transaction(async (tx) => {

    const activity = await tx.activity.findFirst({
      where: {
        id: activityId,
        isDeleted: false,
      },
      include: {
        location: true,
        activityFile: true,
        schedules: {
          include: {
            files: true,
          },
        },
      },
    });

    if (!activity) {
      throw new Error("Activity not found");
    }

    if (activity.locationId && activityData.location) {
      await tx.location.update({
        where: {
          id: activity.locationId,
        },
        data: {
          name: activityData.location.name,
          zone: activityData.location.zone,
          province: activityData.location.province,
          district: activityData.location.district,
          subDistrict: activityData.location.subDistrict,
          detail: activityData.location.detail,
          latitude: activityData.location.latitude,
          longitude: activityData.location.longitude,
        },
      });
    }
    await tx.activity.update({
      where: {
        id: activityId,
      },
      data: {
        ...(activityData.name !== undefined && {
          name: activityData.name,
        }),

        ...(activityData.tagline !== undefined && {
          tagline: activityData.tagline,
        }),

        ...(activityData.description !== undefined && {
          description: activityData.description,
        }),

        ...(activityData.activityType !== undefined && {
          activityType: activityData.activityType,
        }),

        ...(activityData.phone !== undefined && {
          phone: activityData.phone,
        }),

        ...(activityData.lineUrl !== undefined && {
          lineUrl: activityData.lineUrl,
        }),

        ...(activityData.facebookUrl !== undefined && {
          facebookUrl: activityData.facebookUrl,
        }),

        ...(activityData.price !== undefined && {
          price: activityData.price,
        }),

        ...(activityData.statusActivity !== undefined && {
          statusActivity: activityData.statusActivity,
        }),
        statusApprove: ActivityApproveStatus.APPROVE,

        ...(activityData.startDate !== undefined && {
          startDate: new Date(activityData.startDate),
        }),

        ...(activityData.dueDate !== undefined && {
          dueDate: new Date(activityData.dueDate),
        }),
        updatedBy: {
          connect: {
            id: userId,
          },
        },
      },
    });
    if (cover) {
      await tx.activityFile.deleteMany({
        where: {
          activityId: activityId,
          type: ImageType.COVER,
        },
      });
      await tx.activityFile.create({
        data: {
          activityId: activityId,
          filePath: cover.filename,
          type: ImageType.COVER,
        },
      });
    }
    if (
      Array.isArray(activityData.mediaDeleteIds) &&
      activityData.mediaDeleteIds.length > 0
    ) {
      await tx.activityFile.deleteMany({
        where: {
          id: {
            in: activityData.mediaDeleteIds,
          },
          activityId: activityId,
          type: {
            in: [ImageType.GALLERY, ImageType.VIDEO],
          },
        },
      });
    }
    for (const file of media) {
      const extension = file.originalname
        .split(".")
        .pop()
        ?.toLowerCase();

      await tx.activityFile.create({
        data: {
          activityId: activityId,
          filePath: file.filename,
          type:
            extension === "mp4" ||
              extension === "mov" ||
              extension === "m4v" ||
              extension === "webm"
              ? ImageType.VIDEO
              : ImageType.GALLERY,
        },
      });
    }
    if (Array.isArray(activityData.schedules)) {
      if (
        Array.isArray(activityData.scheduleDeleteIds) &&
        activityData.scheduleDeleteIds.length > 0
      ) {
        await tx.activitySchedule.deleteMany({
          where: {
            id: {
              in: activityData.scheduleDeleteIds,
            },
            activityId: activityId,
          },
        });
      }
      for (const schedule of activityData.schedules) {
        let scheduleId: number;
        if (schedule.id) {
          const existingSchedule =
            await tx.activitySchedule.findFirst({
              where: {
                id: schedule.id,
                activityId: activityId,
              },
            });

          if (!existingSchedule) {
            throw new Error("Activity schedule not found");
          }
          const updatedSchedule =
            await tx.activitySchedule.update({
              where: {
                id: schedule.id,
              },
              data: {
                ...(schedule.title !== undefined && {
                  title: schedule.title,
                }),

                ...(schedule.description !== undefined && {
                  description: schedule.description,
                }),

                startDateTime: new Date(schedule.startDateTime),
                endDateTime: new Date(schedule.endDateTime),
              },
            });

          scheduleId = updatedSchedule.id;
          if (
            Array.isArray(schedule.deleteFileIds) &&
            schedule.deleteFileIds.length > 0
          ) {
            await tx.activityScheduleFile.deleteMany({
              where: {
                id: {
                  in: schedule.deleteFileIds,
                },
                scheduleId: scheduleId,
              },
            });
          }
        } else {
          const createdSchedule =
            await tx.activitySchedule.create({
              data: {
                activityId: activityId,
                title: schedule.title,
                description: schedule.description,
                startDateTime: new Date(schedule.startDateTime),
                endDateTime: new Date(schedule.endDateTime),
              },
            });

          scheduleId = createdSchedule.id;
        }
        if (Array.isArray(schedule.fileIndexes)) {
          for (const index of schedule.fileIndexes) {
            const file = scheduleFiles[index];

            if (!file) {
              continue;
            }
            await tx.activityScheduleFile.create({
              data: {
                scheduleId: scheduleId,
                filePath: file.filename,
                type: ImageType.GALLERY,
              },
            });
          }
        }
      }
    }
    return await tx.activity.findUnique({
      where: {
        id: activityId,
      },
      include: {
        location: true,
        createdBy: {
          select: {
            id: true,
            fname: true,
            lname: true,
            email: true,
          },
        },
        updatedBy: {
          select: {
            id: true,
            fname: true,
            lname: true,
            email: true,
          },
        },
        activityFile: true,
        schedules: {
          orderBy: {
            startDateTime: "asc",
          },
          include: {
            files: true,
          },
        },
      },
    });
  });
}

/*
 * คำอธิบาย : SuperAdmin อนุมัติกิจกรรม
 * Input : id - รหัสกิจกรรม, userId - ผู้อนุมัติ
 * Output : กิจกรรมที่อนุมัติแล้ว
 */
export const approveActivityBySuperAdmin = async (
  id: number,
  userId: number
) => {
  const activity =
    await prisma.activity.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });
  if (!activity) {
    throw new Error("Activity not found");
  }
  if (
    activity.statusApprove !== "PENDING"
  ) {
    throw new Error(
      "Activity already processed"
    );
  }
  return prisma.activity.update({
    where: {
      id
    },
    data: {
      statusApprove:
        "APPROVE",
      statusActivity:
        "PUBLISH",
      updatedById:
        userId,
      rejectReason:
        null
    }
  });
};

/*
 * คำอธิบาย : SuperAdmin ปฏิเสธกิจกรรม
 * Input : id - รหัสกิจกรรม, userId - ผู้ตรวจสอบ, reason - เหตุผล
 * Output : กิจกรรมที่ถูก Reject
 */
export const rejectActivityBySuperAdmin = async (
  id: number,
  userId: number,
  reason: string
) => {
  const activity =
    await prisma.activity.findFirst({
      where: {
        id,
        isDeleted: false
      }
    });
  if (!activity) {
    throw new Error(
      "Activity not found"
    );
  }
  if (
    activity.statusApprove !== "PENDING"
  ) {
    throw new Error(
      "Activity already processed"
    );
  }
  return prisma.activity.update({
    where: {
      id
    },
    data: {
      statusApprove:
        "REJECTED",
      statusActivity:
        "UNPUBLISH",
      rejectReason:
        reason,
      updatedById:
        userId
    }
  });
};

/**
 * คำอธิบาย : SuperAdmin ดึงรายการกิจกรรมที่รออนุมัติ
 * Input : query - Query สำหรับ Pagination และ Search
 * Output : รายการกิจกรรม Pending สำหรับหน้าอนุมัติ
 */
export const getRequestsActivitiesForSuperAdmin = async (
  query: PaginationDto
): Promise<PaginationResponse<any>> => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const skip = (page - 1) * limit;

  const where: any = {
    isDeleted: false,
    statusApprove: ActivityApproveStatus.PENDING,
  };

  // Search ชื่อกิจกรรม
  if (query.search?.trim()) {
    where.name = {
      contains: query.search.trim(),
    };
  }

  // Filter ประเภทกิจกรรม
  if (query.activityType) {
    where.activityType = query.activityType;
  }

  // Filter สถานที่
  if (
    query.zone ||
    query.province ||
    query.district ||
    query.subDistrict
  ) {
    where.location = {};

    if (query.zone) {
      where.location.zone = query.zone;
    }

    if (query.province) {
      where.location.province = query.province;
    }

    if (query.district) {
      where.location.district = query.district;
    }

    if (query.subDistrict) {
      where.location.subDistrict = query.subDistrict;
    }
  }

  // Filter วันที่เริ่มกิจกรรม
  if (query.startDate) {
    const startDate = new Date(`${query.startDate}T00:00:00`);
    const nextDate = new Date(startDate);

    nextDate.setDate(nextDate.getDate() + 1);

    where.startDate = {
      gte: startDate,
      lt: nextDate,
    };
  }

  // Filter วันที่สิ้นสุดกิจกรรม
  if (query.dueDate) {
    const dueDate = new Date(`${query.dueDate}T00:00:00`);
    const nextDate = new Date(dueDate);

    nextDate.setDate(nextDate.getDate() + 1);

    where.dueDate = {
      gte: dueDate,
      lt: nextDate,
    };
  }

  const [data, totalCount] = await prisma.$transaction([
    prisma.activity.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        activityType: true,
        startDate: true,
        dueDate: true,
        location: {
          select: {
            name: true,
            zone: true,
            province: true,
            district: true,
            subDistrict: true,
          },
        },
      },
    }),

    prisma.activity.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
    },
  };
};

/*
 * คำอธิบาย : SuperAdmin ดูรายละเอียดกิจกรรมที่รออนุมัติ
 * Input : id - รหัสกิจกรรม
 * Output : รายละเอียดกิจกรรม Pending
 */
export const getRequestsActivityDetailForSuperAdmin = async (
  id: number
) => {
  const activity =
    await prisma.activity.findFirst({
      where: {
        id,
        isDeleted: false,
        statusApprove: "PENDING",
      },
      include: {
        location: true,
        activityFile: true,
        schedules: {
          orderBy: {
            startDateTime: "asc",
          },
          include: {
            files: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            username: true,
            fname: true,
            lname: true,
            email: true,
          },
        },
        updatedBy: {
          select: {
            id: true,
            username: true,
            fname: true,
            lname: true,
            email: true,
          },
        },
      },
    });
  if (!activity) {
    throw new Error(
      "ไม่พบกิจกรรมที่รออนุมัติ"
    );
  }
  return activity;
};

/*
 * คำอธิบาย : ดึงรายละเอียดกิจกรรมสำหรับหน้า Home
 * Input : id - รหัส Activity
 * Output :
 * ชื่อ
 * คำโปรย
 * รูปทั้งหมด
 * วันที่
 * สถานที่
 * พิกัด
 * ช่องทางติดต่อ
 * ค่าเข้าชม
 * รายละเอียด
 * กำหนดการทั้งหมด
 */
export const getActivityDetailForHome = async (
  id: number
) => {
  const activity =
    await prisma.activity.findFirst({
      where: {
        id,
        isDeleted: false,
        statusApprove: "APPROVE",
        statusActivity: "PUBLISH",
      },
      select: {
        id: true,
        name: true,
        tagline: true,
        description: true,
        activityType: true,
        startDate: true,
        dueDate: true,
        price: true,
        phone: true,
        lineUrl: true,
        facebookUrl: true,
        activityFile: {
          select: {
            id: true,
            filePath: true,
            type: true,
          }
        },
        location: {
          select: {
            id: true,
            name: true,
            zone: true,
            province: true,
            district: true,
            subDistrict: true,
            detail: true,
            latitude: true,
            longitude: true,
          }
        },
        schedules: {
          orderBy: {
            startDateTime: "asc"
          },
          select: {
            id: true,
            title: true,
            description: true,
            startDateTime: true,
            endDateTime: true,

            files: {
              select: {
                id: true,
                filePath: true,
                type: true,
              }
            }
          }
        }
      }
    });
  if (!activity) {
    throw new Error(
      "ไม่พบกิจกรรม"
    );
  }
  await prisma.activity.update({
    where: {
      id,
    },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });
  
  const relatedActivities =
    await prisma.activity.findMany({
      where: {
        isDeleted: false,
        statusApprove: "APPROVE",
        statusActivity: "PUBLISH",
        activityType: activity.activityType,
        id: {
          not: id
        }
      },
      take: 4,
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        name: true,
        tagline: true,
        startDate: true,
        dueDate: true,
        price: true,
        phone: true,
        lineUrl: true,
        facebookUrl: true,
        activityFile: {
          where: {
            type: "COVER"
          },
          select: {
            filePath: true
          },
          take: 1
        },
        location: {
          select: {
            name: true,
            province: true,
            district: true,
            subDistrict: true,
          }
        }
      }
    });
  return {
    activity,
    relatedActivities
  };
};

/**
 * คำอธิบาย : ดึงรายการกิจกรรมสำหรับหน้า Home ตามเดือนปัจจุบัน
 * Input : query - ข้อมูล Pagination
 * Output : รายการกิจกรรมที่จัดในเดือนปัจจุบัน พร้อมข้อมูล Pagination
 */
export const getHomeActivity = async (
  query: ActivityQueryDto
): Promise<PaginationResponse<any>> => {
  const now = new Date();

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  const page = Number(query.page ?? 1);
  const limit = 4;
  const skip = (page - 1) * limit;

  const where = {
    isDeleted: false,
    statusApprove: ActivityApproveStatus.APPROVE,
    statusActivity: ActivityPublishStatus.PUBLISH,
    startDate: {
      gte: startOfMonth,
      lte: endOfMonth,
    },
  };

  const [data, totalCount] = await prisma.$transaction([
    prisma.activity.findMany({
      where,
      skip,
      take: limit,

      orderBy: {
        startDate: "asc",
      },

      select: {
        id: true,
        name: true,
        tagline: true,
        activityType: true,
        startDate: true,
        dueDate: true,
        price: true,
        phone: true,
        lineUrl: true,

        activityFile: {
          where: {
            type: ImageType.COVER,
          },
          select: {
            id: true,
            filePath: true,
          },
          take: 1,
        },

        location: {
          select: {
            name: true,
            province: true,
            district: true,
            subDistrict: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    }),

    prisma.activity.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
    },
  };
};

/*
 * คำอธิบาย : Admin ดึงรายการกิจกรรม Draft ของตัวเอง
 * Input : userId - เจ้าของกิจกรรม
 * Output : ชื่อ ประเภท สถานที่ และสถานะ
 */
export const getDraftActivityByAdmin = async (
  userId: number
) => {
  return await prisma.activity.findMany({
    where: {
      isDeleted: false,
      createById: userId,
      statusActivity: "DRAFT",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      activityType: true,
      statusActivity: true,
      statusApprove: true,
      location: {
        select: {
          name: true,
          province: true,
          district: true,
          subDistrict: true,
        }
      }
    }
  });
};

/*
 * คำอธิบาย : Admin ลบกิจกรรม Draft ของตัวเอง
 * Input : activityId - รหัสกิจกรรม, userId - เจ้าของกิจกรรม
 * Output : ข้อมูลกิจกรรมที่ถูกลบ
 */
export const deleteDraftActivityByAdmin = async (
  activityId: number,
  userId: number
) => {
  const activity =
    await prisma.activity.findFirst({
      where: {
        id: activityId,
        createById: userId,
        isDeleted: false,
        statusActivity: "DRAFT",
      },
    });
  if (!activity) {
    throw new Error(
      "ไม่พบกิจกรรม Draft หรือไม่มีสิทธิ์ลบ"
    );
  }
  return prisma.activity.update({
    where: {
      id: activityId,
    },
    data: {
      isDeleted: true,
      deleteAt: new Date(),
    },
  });
};

/**
 * คำอธิบาย : SuperAdmin ดึงประวัติกิจกรรมที่สิ้นสุดแล้วทั้งหมด
 * Input : query - ข้อมูล Pagination และ Search
 * Output : รายการกิจกรรมที่สิ้นสุดแล้ว พร้อมชื่อ ประเภท สถานที่
 *          วันจัดกิจกรรม ค่าเข้าชม จำนวนการเข้าชม และข้อมูล Pagination
 */
export async function getActivityHistoryBySuperAdmin(
  query: PaginationDto
): Promise<PaginationResponse<any>> {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const skip = (page - 1) * limit;

  const where: any = {
    isDeleted: false,

    // แสดงเฉพาะกิจกรรมที่สิ้นสุดแล้ว
    dueDate: {
      lt: new Date(),
    },
  };

  // Search ชื่อกิจกรรม
  if (query.search?.trim()) {
    where.name = {
      contains: query.search.trim(),
    };
  }

  // Filter ประเภทกิจกรรม
  if (query.activityType) {
    where.activityType = query.activityType;
  }

  // Filter สถานที่
  if (
    query.zone ||
    query.province ||
    query.district ||
    query.subDistrict
  ) {
    where.location = {};

    if (query.zone) {
      where.location.zone = query.zone;
    }

    if (query.province) {
      where.location.province = query.province;
    }

    if (query.district) {
      where.location.district = query.district;
    }

    if (query.subDistrict) {
      where.location.subDistrict = query.subDistrict;
    }
  }

  // Filter วันที่เริ่มกิจกรรม
  if (query.startDate) {
    const startDate = new Date(`${query.startDate}T00:00:00`);
    const nextDate = new Date(startDate);

    nextDate.setDate(nextDate.getDate() + 1);

    where.startDate = {
      gte: startDate,
      lt: nextDate,
    };
  }

  // Filter วันที่สิ้นสุดกิจกรรม
  if (query.dueDate) {
    const dueDate = new Date(`${query.dueDate}T00:00:00`);
    const nextDate = new Date(dueDate);

    nextDate.setDate(nextDate.getDate() + 1);

    where.dueDate = {
      gte: dueDate,
      lt: nextDate,
    };
  }

  const [data, totalCount] = await prisma.$transaction([
    prisma.activity.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        activityType: true,
        startDate: true,
        dueDate: true,
        price: true,
        viewCount: true,
        location: {
          select: {
            name: true,
            zone: true,
            province: true,
            district: true,
            subDistrict: true,
          },
        },
      },
      orderBy: {
        dueDate: "desc",
      },
    }),

    prisma.activity.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
    },
  };
}

/**
 * คำอธิบาย : Admin ดึงประวัติกิจกรรมที่สิ้นสุดแล้วของตัวเอง
 * Input : userId - เจ้าของกิจกรรม, query - ข้อมูล Pagination และ Search
 * Output : รายการกิจกรรมที่สิ้นสุดแล้วของตัวเอง พร้อมชื่อ ประเภท สถานที่
 *          วันจัดกิจกรรม ค่าเข้าชม จำนวนการเข้าชม และข้อมูล Pagination
 */
export async function getActivityHistoryByAdmin(
  userId: number,
  query: PaginationDto
): Promise<PaginationResponse<any>> {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const skip = (page - 1) * limit;

  const where: any = {
    createById: userId,
    isDeleted: false,

    // เฉพาะกิจกรรมที่สิ้นสุดแล้ว
    dueDate: {
      lt: new Date(),
    },
  };

  // Search ชื่อกิจกรรม
  if (query.search?.trim()) {
    where.name = {
      contains: query.search.trim(),
    };
  }

  // Filter ประเภทกิจกรรม
  if (query.activityType) {
    where.activityType = query.activityType;
  }

  // Filter สถานที่
  if (
    query.zone ||
    query.province ||
    query.district ||
    query.subDistrict
  ) {
    where.location = {};

    if (query.zone) {
      where.location.zone = query.zone;
    }

    if (query.province) {
      where.location.province = query.province;
    }

    if (query.district) {
      where.location.district = query.district;
    }

    if (query.subDistrict) {
      where.location.subDistrict = query.subDistrict;
    }
  }

  // Filter วันที่เริ่มกิจกรรม
  if (query.startDate) {
    const startDate = new Date(`${query.startDate}T00:00:00`);
    const nextDate = new Date(startDate);

    nextDate.setDate(nextDate.getDate() + 1);

    where.startDate = {
      gte: startDate,
      lt: nextDate,
    };
  }

  // Filter วันที่สิ้นสุดกิจกรรม
  if (query.dueDate) {
    const dueDate = new Date(`${query.dueDate}T00:00:00`);
    const nextDate = new Date(dueDate);

    nextDate.setDate(nextDate.getDate() + 1);

    where.dueDate = {
      gte: dueDate,
      lt: nextDate,
    };
  }

  const [data, totalCount] = await prisma.$transaction([
    prisma.activity.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        activityType: true,
        startDate: true,
        dueDate: true,
        price: true,
        viewCount: true,
        location: {
          select: {
            name: true,
            zone: true,
            province: true,
            district: true,
            subDistrict: true,
          },
        },
      },
      orderBy: {
        dueDate: "desc",
      },
    }),

    prisma.activity.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
    },
  };
}
