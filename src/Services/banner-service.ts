import prisma from "./database-service.js";

export const createBanner = async(
  image:string
)=>{
  return prisma.banner.create({
    data:{
      image
    }
  });
};

export const getBanner = async()=>{
  return prisma.banner.findMany({
    orderBy:{
      id:"desc"
    }
  });
};

export const getBannerById = async(
  id:number
)=>{
  const banner =
    await prisma.banner.findUnique({
      where:{
        id
      }
    });
  if(!banner){
    throw new Error(
      "ไม่พบ Banner"
    );
  }
  return banner;
};

export const updateBanner = async(
  id:number,
  image:string
)=>{
  const banner =
    await prisma.banner.findUnique({
      where:{
        id
      }
    });
  if(!banner){
    throw new Error(
      "ไม่พบ Banner"
    );
  }
  return prisma.banner.update({
    where:{
      id
    },
    data:{
      image
    }
  });
};

export const deleteBanner = async(
  id:number
)=>{
  const banner =
    await prisma.banner.findUnique({
      where:{
        id
      }
    });
  if(!banner){
    throw new Error(
      "ไม่พบ Banner"
    );
  }
  return prisma.banner.delete({
    where:{
      id
    }
  });
};