import type { Request, Response } from "express";
import * as BannerService from "../Services/banner-service.js";


/*
 * SuperAdmin เพิ่ม Banner
 */
export const createBanner = async (
  req: Request,
  res: Response
) => {
  try {
    if(!req.file){
      return res.status(400).json({
        error:true,
        message:"กรุณาอัปโหลดรูป Banner"
      });
    }
    const image =
      req.file.path.replaceAll("\\","/");
    const result =
      await BannerService.createBanner(
        image
      );
    return res.status(200).json({
      error:false,
      message:
        "Create banner successfully",
      data:result
    });
  } catch(error){
    return res.status(400).json({
      error:true,
      message:
      (error as Error).message
    });
  }
};

/*
 * ดู Banner ทั้งหมด
 */
export const getBanner = async(
  req:Request,
  res:Response
)=>{
  try{
    const result =
      await BannerService.getBanner();
    return res.status(200).json({
      error:false,
      message:
      "Get banner successfully",
      data:result
    });
  }catch(error){
    return res.status(400).json({
      error:true,
      message:
      (error as Error).message
    });
  }
};

/*
 * ดู Banner ตาม id
 */
export const getBannerById = async(
  req:Request,
  res:Response
)=>{
  try{
    const id =
      Number(req.params.id);
    const result =
      await BannerService.getBannerById(id);
    return res.status(200).json({
      error:false,
      message:
      "Get banner successfully",
      data:result
    });
  }catch(error){
    return res.status(400).json({
      error:true,
      message:
      (error as Error).message
    });
  }
};

/*
 * แก้ไข Banner
 */
export const updateBanner = async(
  req:Request,
  res:Response
)=>{
  try{
    const id =
      Number(req.params.id);
    if(!req.file){
      return res.status(400).json({
        error:true,
        message:
        "กรุณาอัปโหลดรูปใหม่"
      });
    }
    const image =
      req.file.path.replaceAll("\\","/");
    const result =
      await BannerService.updateBanner(
        id,
        image
      );
    return res.status(200).json({
      error:false,
      message:
      "Update banner successfully",
      data:result
    });
  }catch(error){
    return res.status(400).json({
      error:true,
      message:
      (error as Error).message
    });
  }
};

/*
 * ลบ Banner
 */
export const deleteBanner = async(
  req:Request,
  res:Response
)=>{
  try{
    const id =
      Number(req.params.id);
    const result =
      await BannerService.deleteBanner(id);
    return res.status(200).json({
      error:false,
      message:
      "Delete banner successfully",
      data:result
    });
  }catch(error){
    return res.status(400).json({
      error:true,
      message:
      (error as Error).message
    });
  }
};