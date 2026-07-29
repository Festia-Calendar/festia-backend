/*
 * คำอธิบาย :
 * Service สำหรับจัดการข้อมูล Activity
 * ใช้ Prisma ORM ในการติดต่อฐานข้อมูล
*/
import prisma from "../Services/database-service.js";

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
export const createActivityBySuperAdmin = async (
  userId: number,
  data: any
) => {
  let locationId: number | null = null;
  if (data.location) {
    const location = await prisma.location.create({
      data: {
        name: data.location.name,
        zone: data.location.zone,
        province: data.location.province,
        district: data.location.district,
        subDistrict: data.location.subDistrict,
        detail: data.location.detail ?? null,
        latitude: Number(data.location.latitude),
        longitude: Number(data.location.longitude),
      }
    });
    locationId = location.id;
  }
  return prisma.activity.create({
    data: {
      createById: userId,
      updatedById: userId,
      locationId,
      name: data.name,
      tagline: data.tagline ?? null,
      description: data.description ?? null,
      activityType: data.activityType,
      phone: data.phone ?? null,
      lineUrl: data.lineUrl ?? null,
      facebookUrl: data.facebookUrl ?? null,
      price: data.price ?? null,
      startDate: data.startDate
        ? new Date(data.startDate)
        : null,
      dueDate: data.dueDate
        ? new Date(data.dueDate)
        : null,
      statusActivity:
        data.statusActivity ?? "PUBLISH",
      statusApprove:
        data.statusApprove ?? "PENDING",
      activityFile: {
        create:
          data.activityFiles?.map((file: any) => ({
            filePath: file.filePath,
            type: file.type,
          })) ?? []
      },
      schedules: {
        create:
          data.schedules?.map((item: any) => ({
            title: item.title ?? null,
            description:
              item.description ?? null,
            startDateTime:
              new Date(item.startDateTime),
            endDateTime:
              new Date(item.endDateTime),
            files: {
              create:
                item.files?.map((file: any) => ({
                  filePath: file.filePath,
                  type: file.type,
                })) ?? []
            }
          })) ?? []
      }
    },
    include: {
      location: true,
      activityFile: true,
      schedules: {
        include: {
          files: true
        }
      }
    }
  });
};

/*
 * คำอธิบาย : สร้างกิจกรรมโดย Admin
 * Input : userId - ผู้สร้าง, data - ข้อมูลกิจกรรม
 * Output : ข้อมูลกิจกรรม พร้อม location, files และ schedules
 */
export const createActivityByAdmin = async (
  userId: number,
  data: any
) => {
  let locationId: number | null = null;
  if (data.location) {
    const location = await prisma.location.create({
      data: {
        name: data.location.name,
        zone: data.location.zone,
        province: data.location.province,
        district: data.location.district,
        subDistrict: data.location.subDistrict,
        detail: data.location.detail ?? null,
        latitude: Number(data.location.latitude),
        longitude: Number(data.location.longitude),
      }
    });
    locationId = location.id;
  }
  return prisma.activity.create({
    data: {
      createById: userId,
      updatedById: userId,
      locationId,
      name: data.name,
      tagline: data.tagline ?? null,
      description: data.description ?? null,
      activityType: data.activityType,
      phone: data.phone ?? null,
      lineUrl: data.lineUrl ?? null,
      facebookUrl: data.facebookUrl ?? null,
      price: data.price ?? null,
      startDate: data.startDate
        ? new Date(data.startDate)
        : null,
      dueDate: data.dueDate
        ? new Date(data.dueDate)
        : null,
      statusActivity: "UNPUBLISH",
      statusApprove: "PENDING",
      activityFile: {
        create:
          data.activityFiles?.map((file: any) => ({
            filePath: file.filePath,
            type: file.type,
          })) ?? []
      },
      schedules: {
        create:
          data.schedules?.map((item: any) => ({
            title: item.title ?? null,
            description:
              item.description ?? null,
            startDateTime:
              new Date(item.startDateTime),
            endDateTime:
              new Date(item.endDateTime),
            files: {
              create:
                item.files?.map((file: any) => ({
                  filePath: file.filePath,
                  type: file.type,
                })) ?? []
            }
          })) ?? []
      }
    },
    include: {
      location: true,
      activityFile: true,
      schedules: {
        include: {
          files: true
        }
      }
    }
  });
};


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
export const updateActivityByAdmin = async (
  id: number,
  userId: number,
  data: any
) => {
  const activity = await prisma.activity.findFirst({
    where: {
      id,
      createById: userId,
      isDeleted: false,
    }
  });
  if (!activity) {
    throw new Error("Activity not found");
  }
  let locationId = activity.locationId;
  if (data.location) {

    if (locationId) {

      await prisma.location.update({
        where: {
          id: locationId
        },
        data: {
          name: data.location.name,
          zone: data.location.zone,
          province: data.location.province,
          district: data.location.district,
          subDistrict: data.location.subDistrict,
          detail: data.location.detail ?? null,
          latitude: Number(data.location.latitude),
          longitude: Number(data.location.longitude)
        }
      });
    } else {
      const location =
        await prisma.location.create({
          data: {
            ...data.location,
            latitude: Number(data.location.latitude),
            longitude: Number(data.location.longitude)
          }
        });
      locationId = location.id;
    }
  }
  await prisma.activityFile.deleteMany({
    where: {
      activityId: id
    }
  });
  await prisma.activitySchedule.deleteMany({
    where: {
      activityId: id
    }
  });
  return prisma.activity.update({
    where: {
      id
    },
    data: {
      locationId,
      updatedById: userId,
      name: data.name,
      tagline: data.tagline ?? null,
      description: data.description ?? null,
      activityType: data.activityType,
      phone: data.phone ?? null,
      lineUrl: data.lineUrl ?? null,
      facebookUrl: data.facebookUrl ?? null,
      price: data.price ?? null,
      startDate: data.startDate
        ? new Date(data.startDate)
        : null,
      dueDate: data.dueDate
        ? new Date(data.dueDate)
        : null,
      activityFile: {
        create:
          data.activityFiles?.map((file: any) => ({
            filePath: file.filePath,
            type: file.type
          })) ?? []
      },
      schedules: {
        create:
          data.schedules?.map((item: any) => ({
            title: item.title ?? null,
            description: item.description ?? null,
            startDateTime:
              new Date(item.startDateTime),
            endDateTime:
              new Date(item.endDateTime),
            files: {
              create:
                item.files?.map((file: any) => ({
                  filePath: file.filePath,
                  type: file.type
                })) ?? []
            }
          })) ?? []
      },
      statusActivity: "UNPUBLISH",
      statusApprove: "PENDING"
    },
    include: {
      location: true,
      activityFile: true,
      schedules: {
        include: {
          files: true
        }
      }
    }
  });
};

/*
 * คำอธิบาย : แก้ไขกิจกรรมโดย SuperAdmin
 * Input : id - รหัสกิจกรรม, userId - ผู้แก้ไข, data - ข้อมูลใหม่
 * Output : ข้อมูลกิจกรรมที่แก้ไขแล้ว
 */
export const updateActivityBySuperAdmin = async (
  id: number,
  userId: number,
  data: any
) => {
  const activity = await prisma.activity.findFirst({
    where: {
      id,
      isDeleted: false
    }
  });
  if (!activity) {
    throw new Error("Activity not found");
  }
  let locationId = activity.locationId;
  if (data.location) {
    if (locationId) {
      await prisma.location.update({
        where: {
          id: locationId
        },
        data: {
          name: data.location.name,
          zone: data.location.zone,
          province: data.location.province,
          district: data.location.district,
          subDistrict: data.location.subDistrict,
          detail: data.location.detail ?? null,
          latitude: Number(data.location.latitude),
          longitude: Number(data.location.longitude)
        }
      });
    } else {
      const location =
        await prisma.location.create({
          data: {
            ...data.location,
            latitude: Number(data.location.latitude),
            longitude: Number(data.location.longitude)
          }
        });
      locationId = location.id;
    }
  }
  await prisma.activityFile.deleteMany({
    where: {
      activityId: id
    }
  });
  await prisma.activitySchedule.deleteMany({
    where: {
      activityId: id
    }
  });
  return prisma.activity.update({
    where: {
      id
    },
    data: {
      locationId,
      updatedById: userId,
      name: data.name,
      tagline: data.tagline ?? null,
      description: data.description ?? null,
      activityType: data.activityType,
      phone: data.phone ?? null,
      lineUrl: data.lineUrl ?? null,
      facebookUrl: data.facebookUrl ?? null,
      price: data.price ?? null,
      startDate: data.startDate
        ? new Date(data.startDate)
        : null,
      dueDate: data.dueDate
        ? new Date(data.dueDate)
        : null,
      activityFile: {
        create:
          data.activityFiles?.map((file: any) => ({
            filePath: file.filePath,
            type: file.type
          })) ?? []
      },
      schedules: {
        create:
          data.schedules?.map((item: any) => ({
            title: item.title ?? null,
            description: item.description ?? null,
            startDateTime:
              new Date(item.startDateTime),
            endDateTime:
              new Date(item.endDateTime),
            files: {
              create:
                item.files?.map((file: any) => ({
                  filePath: file.filePath,
                  type: file.type
                })) ?? []
            }
          })) ?? []
      }
    },
    include: {
      location: true,
      activityFile: true,
      schedules: {
        include: {
          files: true
        }
      }
    }
  });
};

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