import {
  ActivityType,
  ImageType,
  Prisma,
  PrismaClient,
} from "@prisma/client";

const prisma = new PrismaClient();

const ITEMS_PER_PAGE = 4;

interface SearchActivitiesParams {
  keyword?: string;
  zone?: string;
  province?: string;
  district?: string;
  startDate?: string;
  endDate?: string;
  type?: ActivityType;
  page?: number;
}

export const searchActivities = async ({
  keyword,
  zone,
  province,
  district,
  startDate,
  endDate,
  type,
  page = 1,
}: SearchActivitiesParams) => {
  const currentPage = Math.max(Number(page) || 1, 1);

  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const where: Prisma.ActivityWhereInput = {
    statusActivity: "PUBLISH",
    statusApprove: "APPROVE",
    isDeleted: false,
  };

  // =====================================================
  // Magic Search
  // =====================================================

  if (keyword?.trim()) {
    const search = keyword.trim();

    where.OR = [
      {
        name: {
          contains: search,
        },
      },
      {
        tagline: {
          contains: search,
        },
      },
      {
        description: {
          contains: search,
        },
      },
      {
        location: {
          is: {
            name: {
              contains: search,
            },
          },
        },
      },
      {
        location: {
          is: {
            zone: {
              contains: search,
            },
          },
        },
      },
      {
        location: {
          is: {
            province: {
              contains: search,
            },
          },
        },
      },
      {
        location: {
          is: {
            district: {
              contains: search,
            },
          },
        },
      },
      {
        location: {
          is: {
            subDistrict: {
              contains: search,
            },
          },
        },
      },
    ];
  }

  // =====================================================
  // Location Filter
  // =====================================================

  if (zone || province || district) {
    const locationWhere: Prisma.LocationWhereInput = {};

    if (zone?.trim()) {
      locationWhere.zone = zone.trim();
    }

    if (province?.trim()) {
      locationWhere.province = province.trim();
    }

    if (district?.trim()) {
      locationWhere.district = district.trim();
    }

    where.location = {
      is: locationWhere,
    };
  }

  // =====================================================
  // Activity Type
  // =====================================================

  if (type) {
    where.activityType = type;
  }

  // =====================================================
  // Date Filter
  // =====================================================

  if (startDate || endDate) {
    const dateConditions: Prisma.ActivityWhereInput[] = [];

    if (startDate) {
      const start = new Date(startDate);

      if (Number.isNaN(start.getTime())) {
        throw new Error("รูปแบบวันที่เริ่มต้นไม่ถูกต้อง");
      }

      dateConditions.push({
        dueDate: {
          gte: start,
        },
      });
    }

    if (endDate) {
      const end = new Date(endDate);

      if (Number.isNaN(end.getTime())) {
        throw new Error("รูปแบบวันที่สิ้นสุดไม่ถูกต้อง");
      }

      end.setHours(23, 59, 59, 999);

      dateConditions.push({
        startDate: {
          lte: end,
        },
      });
    }

    where.AND = dateConditions;
  }

  // =====================================================
  // Query
  // =====================================================

  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      where,

      skip,
      take: ITEMS_PER_PAGE,

      orderBy: {
        startDate: "asc",
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

        location: {
          select: {
            id: true,
            name: true,
            zone: true,
            province: true,
            district: true,
            subDistrict: true,
            detail: true,
          },
        },

        activityFile: {
          where: {
            type: ImageType.COVER,
          },
          select: {
            id: true,
            filePath: true,
            type: true,
          },
          take: 1,
        },
      },
    }),

    prisma.activity.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return {
    data: activities,

    pagination: {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      total,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  };
};