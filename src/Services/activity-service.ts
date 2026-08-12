/*
 * คำอธิบาย :
 * Service สำหรับจัดการข้อมูล Activity
 * ใช้ Prisma ORM ในการติดต่อฐานข้อมูล
*/
import prisma from "../Services/database-service.js";
import { ImageType, ActivityApproveStatus, } from "@prisma/client";

export const getActivityBySuperAdmin = async () => {
  return await prisma.activity.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      location: true,
      schedules: true,
      createdBy: {
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

export const getActivityByAdmin = async (userId: number) => {
  return await prisma.activity.findMany({
    where: {
      isDeleted: false,
      createById: userId,
    },
    include: {
      location: true,
      schedules: true,
      createdBy: {
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

/*
 * คำอธิบาย : สร้างกิจกรรมโดย SuperAdmin
 * Input : userId - ผู้สร้าง, data - ข้อมูลกิจกรรม
 * Output : ข้อมูลกิจกรรม พร้อม location, files และ schedules
 */
export async function createActivityBySuperAdmin(
  activityData: any,
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

/*
 * คำอธิบาย : สร้างกิจกรรมโดย Admin
 * Input : userId - ผู้สร้าง, data - ข้อมูลกิจกรรม
 * Output : ข้อมูลกิจกรรม พร้อม location, files และ schedules
 */
export async function createActivityByAdmin(
  activityData: any,
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

/*
 * คำอธิบาย : แก้ไขกิจกรรมโดย Admin
 * Input : id - รหัสกิจกรรม, userId - เจ้าของกิจกรรม, data - ข้อมูลใหม่
 * Output : ข้อมูลกิจกรรมที่แก้ไขแล้ว
 */
export async function updateActivityByAdmin(
  activityId: number,
  activityData: any,
  files: Record<string, Express.Multer.File[]>,
  userId: number
) {
  const cover = files.cover?.[0];
  const media = files.media ?? [];
  const scheduleFiles = files.scheduleFiles ?? [];

  return await prisma.$transaction(async (tx) => {
    /*
     * ตรวจสอบว่ามีกิจกรรมหรือไม่
     */
    const activity = await tx.activity.findUnique({
      where: {
        id: activityId,
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

    /*
     * แก้ไข Location
     */
    if (activity.locationId) {
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

    /*
     * แก้ไข Activity
     */
    await tx.activity.update({
      where: {
        id: activityId,
      },
      data: {
        name: activityData.name,
        tagline: activityData.tagline,
        description: activityData.description,
        activityType: activityData.activityType,
        phone: activityData.phone,
        lineUrl: activityData.lineUrl,
        facebookUrl: activityData.facebookUrl,
        price: activityData.price,
        statusActivity: activityData.statusActivity,

        // Admin แก้ไขต้องรออนุมัติใหม่
        statusApprove: ActivityApproveStatus.PENDING,

        startDate: new Date(activityData.startDate),
        dueDate: new Date(activityData.dueDate),

        updatedBy: {
          connect: {
            id: userId,
          },
        },
      },
    });
    /*
     * เปลี่ยนรูปปก
     */
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

    /*
     * ลบ Media เดิม
     * Frontend ส่ง mediaDeleteIds มาเป็น array ของ id
     */
    if (Array.isArray(activityData.mediaDeleteIds)) {
      await tx.activityFile.deleteMany({
        where: {
          id: {
            in: activityData.mediaDeleteIds,
          },
          activityId: activityId,
        },
      });
    }

    /*
     * เพิ่ม Media ใหม่
     */
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

    /*
     * แก้ไขกำหนดการกิจกรรม
     */
        /*
     * ลบกำหนดการที่ Frontend ลบออก
     */
    if (Array.isArray(activityData.scheduleDeleteIds)) {
      await tx.activitySchedule.deleteMany({
        where: {
          id: {
            in: activityData.scheduleDeleteIds,
          },
          activityId: activityId,
        },
      });
    }

    /*
     * เพิ่ม / แก้ไขกำหนดการ
     */
    for (const schedule of activityData.schedules) {
      let scheduleId: number;

      /*
       * ถ้ามี id แสดงว่าเป็นการแก้ไข
       */
      if (schedule.id) {
        const updatedSchedule = await tx.activitySchedule.update({
          where: {
            id: schedule.id,
          },
          data: {
            title: schedule.title,
            description: schedule.description,
            startDateTime: new Date(schedule.startDateTime),
            endDateTime: new Date(schedule.endDateTime),
          },
        });

        scheduleId = updatedSchedule.id;

        /*
         * ลบรูปเดิมที่ผู้ใช้เลือก
         */
        if (Array.isArray(schedule.deleteFileIds)) {
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
        /*
         * สร้างกำหนดการใหม่
         */
        const createdSchedule = await tx.activitySchedule.create({
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

      /*
       * เพิ่มรูปใหม่ของกำหนดการ
       */
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

    /*
     * ส่งข้อมูลกลับ
     */
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
          },
        },

        updatedBy: {
          select: {
            id: true,
            fname: true,
            lname: true,
          },
        },

        activityFile: true,

        schedules: {
          include: {
            files: true,
          },
        },
      },
    });
  });
}

/*
 * คำอธิบาย : แก้ไขกิจกรรมโดย SuperAdmin
 * Input : id - รหัสกิจกรรม, userId - ผู้แก้ไข, data - ข้อมูลใหม่
 * Output : ข้อมูลกิจกรรมที่แก้ไขแล้ว
 */
export async function updateActivityBySuperAdmin(
  activityId: number,
  activityData: any,
  files: Record<string, Express.Multer.File[]>,
  userId: number
) {
  const cover = files?.cover?.[0];
  const media = files?.media ?? [];
  const scheduleFiles = files?.scheduleFiles ?? [];

  return await prisma.$transaction(async (tx) => {
    /*
     * ตรวจสอบว่ามีกิจกรรมหรือไม่
     */
    const activity = await tx.activity.findUnique({
      where: {
        id: activityId,
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

    /*
     * แก้ไข Location
     */
    if (activity.locationId) {
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

    /*
     * แก้ไข Activity
     */
    await tx.activity.update({
      where: {
        id: activityId,
      },
      data: {
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

        startDate: activityData.startDate ? new Date(activityData.startDate) : null,
        dueDate: activityData.dueDate ? new Date(activityData.dueDate) : null,

        updatedBy: {
          connect: {
            id: userId,
          },
        },
      },
    });
    
    /*
     * เปลี่ยนรูปปก หรือลบรูปปกเก่าทิ้ง
     */
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
    } else if (activityData.isCoverDeleted) {
      // ⭐ รับรู้ว่าโดนกดลบรูปปกจาก Frontend
      await tx.activityFile.deleteMany({
        where: {
          activityId: activityId,
          type: ImageType.COVER,
        },
      });
    }

    /*
     * ลบ Media เดิม
     */
    if (Array.isArray(activityData.mediaDeleteIds) && activityData.mediaDeleteIds.length > 0) {
      await tx.activityFile.deleteMany({
        where: {
          id: {
            in: activityData.mediaDeleteIds,
          },
          activityId: activityId,
        },
      });
    }

    /*
     * เพิ่ม Media ใหม่
     */
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

    /*
     * ลบกำหนดการที่ Frontend ลบออก
     */
    if (Array.isArray(activityData.scheduleDeleteIds) && activityData.scheduleDeleteIds.length > 0) {
      await tx.activitySchedule.deleteMany({
        where: {
          id: {
            in: activityData.scheduleDeleteIds,
          },
          activityId: activityId,
        },
      });
    }

    /*
     * เพิ่ม / แก้ไขกำหนดการ
     */
    for (const schedule of activityData.schedules) {
      let scheduleId: number;

      /*
       * ถ้ามี id แสดงว่าเป็นการแก้ไข
       */
      if (schedule.id) {
        const updatedSchedule = await tx.activitySchedule.update({
          where: {
            id: schedule.id,
          },
          data: {
            title: schedule.title,
            description: schedule.description,
            startDateTime: schedule.startDateTime ? new Date(schedule.startDateTime) : null,
            endDateTime: schedule.endDateTime ? new Date(schedule.endDateTime) : null,
          },
        });

        scheduleId = updatedSchedule.id;

        /*
         * ลบรูปเดิมที่ผู้ใช้เลือก
         */
        if (Array.isArray(schedule.deleteFileIds) && schedule.deleteFileIds.length > 0) {
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
        /*
         * สร้างกำหนดการใหม่
         */
        const createdSchedule = await tx.activitySchedule.create({
          data: {
            activityId: activityId,
            title: schedule.title,
            description: schedule.description,
            startDateTime: schedule.startDateTime ? new Date(schedule.startDateTime) : null,
            endDateTime: schedule.endDateTime ? new Date(schedule.endDateTime) : null,
          },
        });

        scheduleId = createdSchedule.id;
      }

      /*
       * เพิ่มรูปใหม่ของกำหนดการ
       */
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

    /*
     * ส่งข้อมูลกลับ
     */
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
          },
        },
        updatedBy: {
          select: {
            id: true,
            fname: true,
            lname: true,
          },
        },
        activityFile: true,
        schedules: {
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

/*
 * คำอธิบาย : SuperAdmin ดึงรายการกิจกรรมที่รออนุมัติ
 * Input : -
 * Output : รายการกิจกรรม Pending สำหรับหน้าอนุมัติ
 */
export const getRequestsActivitiesForSuperAdmin = async () => {
  return await prisma.activity.findMany({
    where: {
      isDeleted: false,
      statusApprove: "PENDING",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      activityType: true,
      startDate: true,
      dueDate: true,
      statusApprove: true,
      location: {
        select: {
          name: true,
          province: true,
          district: true,
          subDistrict: true,
        }
      },
    },
  });
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

/*
 * คำอธิบาย : ดึงรายการกิจกรรมสำหรับหน้า Home ตามเดือนปัจจุบัน
 * Input : -
 * Output : รายการกิจกรรมที่จัดในเดือนปัจจุบัน
 */
export const getHomeActivity = async () => {
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
  return await prisma.activity.findMany({
    where: {
      isDeleted: false,
      statusApprove: "APPROVE",
      statusActivity: "PUBLISH",
      startDate: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    orderBy: {
      startDate: "asc"
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
      facebookUrl: true,
      activityFile: {
        where: {
          type: "COVER"
        },
        select: {
          id: true,
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
          latitude: true,
          longitude: true,
        }
      }
    }
  });
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

/*
 * คำอธิบาย : SuperAdmin ดึงประวัติกิจกรรมที่สิ้นสุดแล้วทั้งหมด
 * Input : -
 * Output : ชื่อกิจกรรม ประเภท สถานที่ วันจัดกิจกรรม ค่าเข้าชม
 */
export async function getActivityHistoryBySuperAdmin() {
  return await prisma.activity.findMany({
    where: {
      isDeleted: false,
      dueDate: {
        lt: new Date(),
      },
    },

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
        },
      },
    },

    orderBy: {
      dueDate: "desc",
    },
  });
}

/*
 * คำอธิบาย : Admin ดึงประวัติกิจกรรมที่สิ้นสุดแล้วของตัวเอง
 * Input : userId - เจ้าของกิจกรรม
 * Output : ชื่อกิจกรรม ประเภท สถานที่ วันจัดกิจกรรม ค่าเข้าชม
 */
export async function getActivityHistoryByAdmin(userId: number) {
  return await prisma.activity.findMany({
    where: {
      createById: userId,
      isDeleted: false,
      dueDate: {
        lt: new Date(),
      },
    },
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
        },
      },
    },
    orderBy: {
      dueDate: "desc",
    },
  });
}
