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
      schedules: {
        orderBy: {
          startDateTime: "asc",
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
};

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
      schedules: {
        orderBy: {
          startDateTime: "asc",
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
};

/*
 * คำอธิบาย : สร้างกิจกรรมโดย SuperAdmin
 * Input : userId - ผู้สร้าง, data - ข้อมูลกิจกรรม
 * Output : ข้อมูลกิจกรรม พร้อม location และ schedules
 */
export const createActivityBySuperAdmin = async (
  userId: number,
  data: any
) => {
  let locationId: number | null = null;

  // สร้าง Location
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

  // สร้าง Activity
  return prisma.activity.create({

    data: {

      createById: userId,
      locationId,
      name: data.name,
      tagline: data.tagline ?? null,
      description: data.description ?? null,

      activityType: data.activityType,

      phone: data.phone ?? null,
      lineUrl: data.lineUrl ?? null,
      facebookUrl: data.facebookUrl ?? null,

      price: data.price ?? null,

      startDate: data.startDate ?? null,
      dueDate: data.dueDate ?? null,

      statusActivity: "PUBLISH",
      statusApprove: "APPROVE",

      schedules: {
        create:
          data.schedules?.map((item: any) => ({
            title: item.title ?? null,
            description:
              item.description ?? null,
            startDateTime:
              item.startDateTime,
            endDateTime:
              item.endDateTime,
          })) ?? []
      }
    },
    include: {
      location: true,
      schedules: true
    }
  });
};

/*
 * คำอธิบาย : สร้างกิจกรรมโดย Admin
 * Input : userId - ผู้สร้าง, data - ข้อมูลกิจกรรม
 * Output : ข้อมูลกิจกรรม พร้อม location และ schedules
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
      locationId,
      name: data.name,
      tagline: data.tagline ?? null,
      description: data.description ?? null,
      activityType: data.activityType,
      phone: data.phone ?? null,
      lineUrl: data.lineUrl ?? null,
      facebookUrl: data.facebookUrl ?? null,
      price: data.price ?? null,
      startDate: data.startDate ?? null,
      dueDate: data.dueDate ?? null,
      statusActivity: "UNPUBLISH",
      statusApprove: "PENDING",
      schedules: {
        create:
          data.schedules?.map((item: any) => ({
            title: item.title ?? null,
            description:
              item.description ?? null,
            startDateTime:
              item.startDateTime,
            endDateTime:
              item.endDateTime,
          })) ?? []
      }
    },
    include: {
      location: true,
      schedules: true
    }
  });
};


export const deleteActivityBySuperAdmin = async (
  activityId: number
) => {
  const activity =
    await prisma.activity.findUnique({
      where:{
        id: activityId
      }
    });

  if(!activity){
    throw new Error(
      "ไม่พบกิจกรรมในระบบ"
    );
  }

  return prisma.activity.update({
    where:{
      id: activityId
    },
    data:{
      isDeleted:true,
      deleteAt:new Date()
    }
  });
};

/*
 * คำอธิบาย : ลบกิจกรรมโดย Admin (Soft Delete)
 * Input : activityId - รหัสกิจกรรม, userId - เจ้าของกิจกรรม
 * Output : ข้อมูลกิจกรรมที่ถูกลบ
 */
export const deleteActivityByAdmin = async (
  activityId:number,
  userId:number
)=>{
  
  const activity =
    await prisma.activity.findFirst({
      where:{
        id:activityId,
        createById:userId,
        isDeleted:false
      }
    });

  if(!activity){
    throw new Error(
      "ไม่พบกิจกรรม หรือไม่มีสิทธิ์ลบ"
    );
  }

  return prisma.activity.update({
    where:{
      id:activityId
    },
    data:{
      isDeleted:true,
      deleteAt:new Date()
    }
  });
};