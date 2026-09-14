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

// =========================================================
// DEFAULT FILES
// =========================================================

const DEFAULT_ACTIVITY_COVER =
  "/uploads/default-cover.jpg";

const DEFAULT_ACTIVITY_GALLERY =
  "/uploads/default-gallery.jpg";

const DEFAULT_ACTIVITY_VIDEO =
  "/uploads/default-video.mp4";

const DEFAULT_SCHEDULE_IMAGE =
  "/uploads/default-schedule.jpg";

// =========================================================
// RANDOM
// =========================================================

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);

    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = mulberry32(20260915);

function randomInt(min: number, max: number) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function randomItem<T>(array: T[]): T {
  return array[Math.floor(random() * array.length)];
}

// =========================================================
// 77 PROVINCES
// =========================================================

const provinces = [
  // ภาคเหนือ
  {
    province: "เชียงใหม่",
    zone: "ภาคเหนือ",
    district: "เมืองเชียงใหม่",
    subDistrict: "ศรีภูมิ",
    latitude: 18.7883,
    longitude: 98.9853,
  },
  {
    province: "เชียงราย",
    zone: "ภาคเหนือ",
    district: "เมืองเชียงราย",
    subDistrict: "เวียง",
    latitude: 19.9105,
    longitude: 99.8406,
  },
  {
    province: "ลำปาง",
    zone: "ภาคเหนือ",
    district: "เมืองลำปาง",
    subDistrict: "เวียงเหนือ",
    latitude: 18.2888,
    longitude: 99.4928,
  },
  {
    province: "ลำพูน",
    zone: "ภาคเหนือ",
    district: "เมืองลำพูน",
    subDistrict: "ในเมือง",
    latitude: 18.5745,
    longitude: 99.0087,
  },
  {
    province: "แม่ฮ่องสอน",
    zone: "ภาคเหนือ",
    district: "เมืองแม่ฮ่องสอน",
    subDistrict: "จองคำ",
    latitude: 19.302,
    longitude: 97.9654,
  },
  {
    province: "แพร่",
    zone: "ภาคเหนือ",
    district: "เมืองแพร่",
    subDistrict: "ในเวียง",
    latitude: 18.1446,
    longitude: 100.1403,
  },
  {
    province: "น่าน",
    zone: "ภาคเหนือ",
    district: "เมืองน่าน",
    subDistrict: "ในเวียง",
    latitude: 18.7832,
    longitude: 100.779,
  },
  {
    province: "พะเยา",
    zone: "ภาคเหนือ",
    district: "เมืองพะเยา",
    subDistrict: "เวียง",
    latitude: 19.1669,
    longitude: 99.9019,
  },
  {
    province: "อุตรดิตถ์",
    zone: "ภาคเหนือ",
    district: "เมืองอุตรดิตถ์",
    subDistrict: "ท่าอิฐ",
    latitude: 17.6201,
    longitude: 100.0993,
  },
  {
    province: "สุโขทัย",
    zone: "ภาคเหนือ",
    district: "เมืองสุโขทัย",
    subDistrict: "ธานี",
    latitude: 17.0078,
    longitude: 99.8265,
  },
  {
    province: "ตาก",
    zone: "ภาคเหนือ",
    district: "เมืองตาก",
    subDistrict: "ระแหง",
    latitude: 16.8839,
    longitude: 99.1258,
  },
  {
    province: "พิษณุโลก",
    zone: "ภาคเหนือ",
    district: "เมืองพิษณุโลก",
    subDistrict: "ในเมือง",
    latitude: 16.8211,
    longitude: 100.2659,
  },
  {
    province: "พิจิตร",
    zone: "ภาคเหนือ",
    district: "เมืองพิจิตร",
    subDistrict: "ในเมือง",
    latitude: 16.4425,
    longitude: 100.3488,
  },
  {
    province: "เพชรบูรณ์",
    zone: "ภาคเหนือ",
    district: "เมืองเพชรบูรณ์",
    subDistrict: "ในเมือง",
    latitude: 16.4189,
    longitude: 101.155,
  },

  // ภาคกลาง
  {
    province: "กรุงเทพมหานคร",
    zone: "ภาคกลาง",
    district: "พระนคร",
    subDistrict: "พระบรมมหาราชวัง",
    latitude: 13.7563,
    longitude: 100.5018,
  },
  {
    province: "กำแพงเพชร",
    zone: "ภาคกลาง",
    district: "เมืองกำแพงเพชร",
    subDistrict: "ในเมือง",
    latitude: 16.4828,
    longitude: 99.5227,
  },
  {
    province: "นครสวรรค์",
    zone: "ภาคกลาง",
    district: "เมืองนครสวรรค์",
    subDistrict: "ปากน้ำโพ",
    latitude: 15.7047,
    longitude: 100.1372,
  },
  {
    province: "ชัยนาท",
    zone: "ภาคกลาง",
    district: "เมืองชัยนาท",
    subDistrict: "ในเมือง",
    latitude: 15.1852,
    longitude: 100.1251,
  },
  {
    province: "อุทัยธานี",
    zone: "ภาคกลาง",
    district: "เมืองอุทัยธานี",
    subDistrict: "อุทัยใหม่",
    latitude: 15.3835,
    longitude: 100.0245,
  },
  {
    province: "นครนายก",
    zone: "ภาคกลาง",
    district: "เมืองนครนายก",
    subDistrict: "นครนายก",
    latitude: 14.2069,
    longitude: 101.2131,
  },
  {
    province: "สระบุรี",
    zone: "ภาคกลาง",
    district: "เมืองสระบุรี",
    subDistrict: "ปากเพรียว",
    latitude: 14.5289,
    longitude: 100.9101,
  },
  {
    province: "ลพบุรี",
    zone: "ภาคกลาง",
    district: "เมืองลพบุรี",
    subDistrict: "ทะเลชุบศร",
    latitude: 14.7995,
    longitude: 100.6534,
  },
  {
    province: "สิงห์บุรี",
    zone: "ภาคกลาง",
    district: "เมืองสิงห์บุรี",
    subDistrict: "บางพุทรา",
    latitude: 14.8936,
    longitude: 100.3967,
  },
  {
    province: "อ่างทอง",
    zone: "ภาคกลาง",
    district: "เมืองอ่างทอง",
    subDistrict: "ตลาดหลวง",
    latitude: 14.5896,
    longitude: 100.4551,
  },
  {
    province: "พระนครศรีอยุธยา",
    zone: "ภาคกลาง",
    district: "พระนครศรีอยุธยา",
    subDistrict: "ประตูชัย",
    latitude: 14.3532,
    longitude: 100.5689,
  },
  {
    province: "สุพรรณบุรี",
    zone: "ภาคกลาง",
    district: "เมืองสุพรรณบุรี",
    subDistrict: "ท่าพี่เลี้ยง",
    latitude: 14.4745,
    longitude: 100.1177,
  },
  {
    province: "นครปฐม",
    zone: "ภาคกลาง",
    district: "เมืองนครปฐม",
    subDistrict: "พระปฐมเจดีย์",
    latitude: 13.8199,
    longitude: 100.0622,
  },
  {
    province: "นนทบุรี",
    zone: "ภาคกลาง",
    district: "เมืองนนทบุรี",
    subDistrict: "สวนใหญ่",
    latitude: 13.8621,
    longitude: 100.5144,
  },
  {
    province: "ปทุมธานี",
    zone: "ภาคกลาง",
    district: "เมืองปทุมธานี",
    subDistrict: "บางปรอก",
    latitude: 14.0208,
    longitude: 100.525,
  },
  {
    province: "สมุทรปราการ",
    zone: "ภาคกลาง",
    district: "เมืองสมุทรปราการ",
    subDistrict: "ปากน้ำ",
    latitude: 13.5991,
    longitude: 100.5998,
  },
  {
    province: "สมุทรสาคร",
    zone: "ภาคกลาง",
    district: "เมืองสมุทรสาคร",
    subDistrict: "มหาชัย",
    latitude: 13.5475,
    longitude: 100.2744,
  },
  {
    province: "สมุทรสงคราม",
    zone: "ภาคกลาง",
    district: "เมืองสมุทรสงคราม",
    subDistrict: "แม่กลอง",
    latitude: 13.4098,
    longitude: 99.9994,
  },
  {
    province: "เพชรบุรี",
    zone: "ภาคกลาง",
    district: "เมืองเพชรบุรี",
    subDistrict: "คลองกระแชง",
    latitude: 13.1119,
    longitude: 99.9398,
  },
  {
    province: "ประจวบคีรีขันธ์",
    zone: "ภาคกลาง",
    district: "เมืองประจวบคีรีขันธ์",
    subDistrict: "ประจวบคีรีขันธ์",
    latitude: 11.8126,
    longitude: 99.797,
  },

  // ภาคตะวันออก
  {
    province: "ชลบุรี",
    zone: "ภาคตะวันออก",
    district: "เมืองชลบุรี",
    subDistrict: "บางปลาสร้อย",
    latitude: 13.3611,
    longitude: 100.9847,
  },
  {
    province: "ระยอง",
    zone: "ภาคตะวันออก",
    district: "เมืองระยอง",
    subDistrict: "ท่าประดู่",
    latitude: 12.6814,
    longitude: 101.2816,
  },
  {
    province: "จันทบุรี",
    zone: "ภาคตะวันออก",
    district: "เมืองจันทบุรี",
    subDistrict: "ตลาด",
    latitude: 12.6113,
    longitude: 102.1038,
  },
  {
    province: "ตราด",
    zone: "ภาคตะวันออก",
    district: "เมืองตราด",
    subDistrict: "บางพระ",
    latitude: 12.2428,
    longitude: 102.5175,
  },
  {
    province: "ฉะเชิงเทรา",
    zone: "ภาคตะวันออก",
    district: "เมืองฉะเชิงเทรา",
    subDistrict: "หน้าเมือง",
    latitude: 13.6904,
    longitude: 101.0779,
  },
  {
    province: "ปราจีนบุรี",
    zone: "ภาคตะวันออก",
    district: "เมืองปราจีนบุรี",
    subDistrict: "หน้าเมือง",
    latitude: 14.0509,
    longitude: 101.3728,
  },
  {
    province: "สระแก้ว",
    zone: "ภาคตะวันออก",
    district: "เมืองสระแก้ว",
    subDistrict: "สระแก้ว",
    latitude: 13.824,
    longitude: 102.0645,
  },

  // ภาคตะวันตก
  {
    province: "กาญจนบุรี",
    zone: "ภาคตะวันตก",
    district: "เมืองกาญจนบุรี",
    subDistrict: "บ้านเหนือ",
    latitude: 14.0228,
    longitude: 99.5328,
  },
  {
    province: "ราชบุรี",
    zone: "ภาคตะวันตก",
    district: "เมืองราชบุรี",
    subDistrict: "หน้าเมือง",
    latitude: 13.5283,
    longitude: 99.8134,
  },

  // ภาคตะวันออกเฉียงเหนือ
  {
    province: "นครราชสีมา",
    zone: "ภาคตะวันออกเฉียงเหนือ",
    district: "เมืองนครราชสีมา",
    subDistrict: "ในเมือง",
    latitude: 14.9799,
    longitude: 102.0978,
  },
  {
    province: "ขอนแก่น",
    zone: "ภาคตะวันออกเฉียงเหนือ",
    district: "เมืองขอนแก่น",
    subDistrict: "ในเมือง",
    latitude: 16.4322,
    longitude: 102.8236,
  },
  {
    province: "อุดรธานี",
    zone: "ภาคตะวันออกเฉียงเหนือ",
    district: "เมืองอุดรธานี",
    subDistrict: "หมากแข้ง",
    latitude: 17.4138,
    longitude: 102.7875,
  },
  {
    province: "เลย",
    zone: "ภาคตะวันออกเฉียงเหนือ",
    district: "เมืองเลย",
    subDistrict: "กุดป่อง",
    latitude: 17.486,
    longitude: 101.7223,
  },
  {
    province: "หนองคาย",
    zone: "ภาคตะวันออกเฉียงเหนือ",
    district: "เมืองหนองคาย",
    subDistrict: "ในเมือง",
    latitude: 17.8783,
    longitude: 102.7413,
  },
  {
    province: "หนองบัวลำภู",
    zone: "ภาคตะวันออกเฉียงเหนือ",
    district: "เมืองหนองบัวลำภู",
    subDistrict: "ลำภู",
    latitude: 17.2041,
    longitude: 102.4407,
  },
  {
    province: "บึงกาฬ",
    zone: "ภาคตะวันออกเฉียงเหนือ",
    district: "เมืองบึงกาฬ",
    subDistrict: "บึงกาฬ",
    latitude: 18.3609,
    longitude: 103.6464,
  },
  {
    province: "สกลนคร",
    zone: "ภาคตะวันออกเฉียงเหนือ",
    district: "เมืองสกลนคร",
    subDistrict: "ธาตุเชิงชุม",
    latitude: 17.1546,
    longitude: 104.1348,
  },
  {
    province: "นครพนม",
    zone: "ภาคตะวันออกเฉียงเหนือ",
    district: "เมืองนครพนม",
    subDistrict: "ในเมือง",
    latitude: 17.392,
    longitude: 104.7695,
  },
  {
    province: "มุกดาหาร",
    zone: "ภาคตะวันออกเฉียงเหนือ",
    district: "เมืองมุกดาหาร",
    subDistrict: "ศรีบุญเรือง",
    latitude: 16.5425,
    longitude: 104.7235,
  },
  {
    province: "กาฬสินธุ์",
    zone: "ภาคตะวันออกเฉียงเหนือ",
    district: "เมืองกาฬสินธุ์",
    subDistrict: "กาฬสินธุ์",
    latitude: 16.4314,
    longitude: 103.5059,
  },
  {
    province: "มหาสารคาม",
    zone: "ภาคตะวันออกเฉียงเหนือ",
    district: "เมืองมหาสารคาม",
    subDistrict: "ตลาด",
    latitude: 16.1851,
    longitude: 103.302,
  },
  {
    province: "ร้อยเอ็ด",
    zone: "ภาคตะวันออกเฉียงเหนือ",
    district: "เมืองร้อยเอ็ด",
    subDistrict: "ในเมือง",
    latitude: 16.0538,
    longitude: 103.652,
  },
  {
    province: "ยโสธร",
    zone: "ภาคตะวันออกเฉียงเหนือ",
    district: "เมืองยโสธร",
    subDistrict: "ในเมือง",
    latitude: 15.7926,
    longitude: 104.1453,
  },
  {
    province: "ศรีสะเกษ",
    zone: "ภาคตะวันออกเฉียงเหนือ",
    district: "เมืองศรีสะเกษ",
    subDistrict: "เมืองใต้",
    latitude: 15.1186,
    longitude: 104.322,
  },
  {
    province: "สุรินทร์",
    zone: "ภาคตะวันออกเฉียงเหนือ",
    district: "เมืองสุรินทร์",
    subDistrict: "ในเมือง",
    latitude: 14.8818,
    longitude: 103.4936,
  },
  {
    province: "บุรีรัมย์",
    zone: "ภาคตะวันออกเฉียงเหนือ",
    district: "เมืองบุรีรัมย์",
    subDistrict: "ในเมือง",
    latitude: 14.993,
    longitude: 103.1029,
  },
  {
    province: "ชัยภูมิ",
    zone: "ภาคตะวันออกเฉียงเหนือ",
    district: "เมืองชัยภูมิ",
    subDistrict: "ในเมือง",
    latitude: 15.8068,
    longitude: 102.031,
  },
  {
    province: "อำนาจเจริญ",
    zone: "ภาคตะวันออกเฉียงเหนือ",
    district: "เมืองอำนาจเจริญ",
    subDistrict: "บุ่ง",
    latitude: 15.8657,
    longitude: 104.6258,
  },
  {
    province: "อุบลราชธานี",
    zone: "ภาคตะวันออกเฉียงเหนือ",
    district: "เมืองอุบลราชธานี",
    subDistrict: "ในเมือง",
    latitude: 15.2287,
    longitude: 104.8564,
  },

  // ภาคใต้
  {
    province: "ชุมพร",
    zone: "ภาคใต้",
    district: "เมืองชุมพร",
    subDistrict: "ท่าตะเภา",
    latitude: 10.493,
    longitude: 99.1801,
  },
  {
    province: "ระนอง",
    zone: "ภาคใต้",
    district: "เมืองระนอง",
    subDistrict: "เขานิเวศน์",
    latitude: 9.9529,
    longitude: 98.6085,
  },
  {
    province: "สุราษฎร์ธานี",
    zone: "ภาคใต้",
    district: "เมืองสุราษฎร์ธานี",
    subDistrict: "ตลาด",
    latitude: 9.1382,
    longitude: 99.3217,
  },
  {
    province: "นครศรีธรรมราช",
    zone: "ภาคใต้",
    district: "เมืองนครศรีธรรมราช",
    subDistrict: "ในเมือง",
    latitude: 8.4304,
    longitude: 99.9631,
  },
  {
    province: "กระบี่",
    zone: "ภาคใต้",
    district: "เมืองกระบี่",
    subDistrict: "ปากน้ำ",
    latitude: 8.0863,
    longitude: 98.9063,
  },
  {
    province: "พังงา",
    zone: "ภาคใต้",
    district: "เมืองพังงา",
    subDistrict: "ท้ายช้าง",
    latitude: 8.451,
    longitude: 98.529,
  },
  {
    province: "ภูเก็ต",
    zone: "ภาคใต้",
    district: "เมืองภูเก็ต",
    subDistrict: "ตลาดใหญ่",
    latitude: 7.8804,
    longitude: 98.3923,
  },
  {
    province: "ตรัง",
    zone: "ภาคใต้",
    district: "เมืองตรัง",
    subDistrict: "ทับเที่ยง",
    latitude: 7.5563,
    longitude: 99.6114,
  },
  {
    province: "พัทลุง",
    zone: "ภาคใต้",
    district: "เมืองพัทลุง",
    subDistrict: "คูหาสวรรค์",
    latitude: 7.6167,
    longitude: 100.074,
  },
  {
    province: "สตูล",
    zone: "ภาคใต้",
    district: "เมืองสตูล",
    subDistrict: "พิมาน",
    latitude: 6.6238,
    longitude: 100.0674,
  },
  {
    province: "สงขลา",
    zone: "ภาคใต้",
    district: "เมืองสงขลา",
    subDistrict: "บ่อยาง",
    latitude: 7.1898,
    longitude: 100.5954,
  },
  {
    province: "ปัตตานี",
    zone: "ภาคใต้",
    district: "เมืองปัตตานี",
    subDistrict: "สะบารัง",
    latitude: 6.8698,
    longitude: 101.2501,
  },
  {
    province: "ยะลา",
    zone: "ภาคใต้",
    district: "เมืองยะลา",
    subDistrict: "สะเตง",
    latitude: 6.5411,
    longitude: 101.2804,
  },
  {
    province: "นราธิวาส",
    zone: "ภาคใต้",
    district: "เมืองนราธิวาส",
    subDistrict: "บางนาค",
    latitude: 6.4255,
    longitude: 101.8253,
  },
];

// =========================================================
// VALIDATE 77 PROVINCES
// =========================================================

const provinceNames = provinces.map(
  (item) => item.province
);

const uniqueProvinceNames = new Set(
  provinceNames
);

if (uniqueProvinceNames.size !== 77) {
  throw new Error(
    `Province data error: expected 77 unique provinces, got ${uniqueProvinceNames.size}`
  );
}

// =========================================================
// ACTIVITY DATA
// =========================================================

const themes = [
  "งานเทศกาลสงกรานต์",
  "งานลอยกระทง",
  "เทศกาลอาหารท้องถิ่น",
  "งานอาหารทะเล",
  "เทศกาลผลไม้",
  "งานวัฒนธรรมไทย",
  "งานศิลปะร่วมสมัย",
  "นิทรรศการภาพถ่าย",
  "นิทรรศการงานฝีมือ",
  "งานดนตรี",
  "คอนเสิร์ตชุมชน",
  "ตลาดชุมชน",
  "ตลาดสินค้าท้องถิ่น",
  "ตลาดนัดสร้างสรรค์",
  "งานวิ่งเพื่อสุขภาพ",
  "กิจกรรมปั่นจักรยาน",
  "การแข่งขันกีฬา",
  "กิจกรรมทางน้ำ",
  "กิจกรรมชายหาด",
  "กิจกรรมอนุรักษ์ธรรมชาติ",
  "กิจกรรมเก็บขยะ",
  "กิจกรรมปลูกต้นไม้",
  "กิจกรรมท่องเที่ยวชุมชน",
  "เวิร์กช็อปอาหารไทย",
  "เวิร์กช็อปงานหัตถกรรม",
  "เวิร์กช็อปศิลปะ",
  "อบรมการตลาดออนไลน์",
  "อบรมผู้ประกอบการ",
  "สัมมนาการท่องเที่ยว",
  "สัมมนาชุมชน",
  "กิจกรรมเยาวชน",
  "กิจกรรมครอบครัว",
  "กิจกรรมผู้สูงอายุ",
  "กิจกรรมเพื่อสังคม",
  "งานแสดงสินค้า",
  "งานของดีประจำจังหวัด",
  "เทศกาลดนตรี",
  "เทศกาลศิลปวัฒนธรรม",
  "งานท่องเที่ยวเชิงสร้างสรรค์",
  "กิจกรรมส่งเสริมสุขภาพ",
];

const taglines = [
  "เปิดประสบการณ์ใหม่ไปพร้อมกับชุมชน",
  "สัมผัสเสน่ห์ท้องถิ่นแบบใกล้ชิด",
  "กิจกรรมดี ๆ ที่ทุกคนมีส่วนร่วมได้",
  "เรียนรู้ สนุก และสร้างความประทับใจ",
  "พบกับสีสันของเมืองและชุมชน",
  "ร่วมสร้างประสบการณ์ที่น่าจดจำ",
  "เที่ยวสนุก ได้ความรู้ และได้พบผู้คน",
  "กิจกรรมสำหรับทุกช่วงวัย",
];

const descriptions = [
  "กิจกรรมที่เปิดโอกาสให้ประชาชนและนักท่องเที่ยวได้เข้าร่วม พร้อมสัมผัสบรรยากาศของชุมชนและเรียนรู้เรื่องราวท้องถิ่น",
  "พบกับกิจกรรมหลากหลายที่จัดขึ้นเพื่อส่งเสริมการท่องเที่ยวและสร้างความสัมพันธ์ระหว่างคนในชุมชน",
  "กิจกรรมส่งเสริมการเรียนรู้และการมีส่วนร่วมของประชาชน ภายในงานมีกิจกรรมที่เหมาะสำหรับทุกช่วงวัย",
  "ร่วมสัมผัสประสบการณ์ด้านวัฒนธรรม อาหาร ศิลปะ และการท่องเที่ยว ผ่านกิจกรรมที่จัดโดยชุมชนในพื้นที่",
  "กิจกรรมที่ผสมผสานความสนุกกับการเรียนรู้ เปิดโอกาสให้ผู้เข้าร่วมได้สัมผัสวิถีชีวิตและภูมิปัญญาท้องถิ่น",
];

const activityTypes = Object.values(ActivityType);

// =========================================================
// USERS
// =========================================================

async function createUsers() {
  const password = await bcrypt.hash(
    "123456",
    10
  );

  const superAdminRole =
    await prisma.role.create({
      data: {
        name: "SUPER_ADMIN",
      },
    });

  const adminRole =
    await prisma.role.create({
      data: {
        name: "ADMIN",
      },
    });

  const superAdmin =
    await prisma.user.create({
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
        isDeleted: false,
      },
    });

  const admin =
    await prisma.user.create({
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
        isDeleted: false,
      },
    });

  return {
    superAdmin,
    admin,
  };
}

// =========================================================
// LOCATIONS
// =========================================================

async function createLocations() {
  const locations = [];

  for (const item of provinces) {
    const location =
      await prisma.location.create({
        data: {
          name: `พื้นที่จัดกิจกรรม${item.province}`,
          zone: item.zone,
          province: item.province,
          district: item.district,
          subDistrict: item.subDistrict,
          detail: `พื้นที่สำหรับจัดกิจกรรมและเทศกาลใน${item.province}`,
          latitude: item.latitude,
          longitude: item.longitude,
        },
      });

    locations.push(location);
  }

  return locations;
}

// =========================================================
// BANNERS
// =========================================================

async function createBanners() {
  await prisma.banner.createMany({
    data: [
      {
        image: "/uploads/banner1.jpg",
      },
      {
        image: "/uploads/banner2.jpg",
      },
      {
        image: "/uploads/banner3.jpg",
      },
    ],
  });
}

// =========================================================
// ACTIVITY STATUS
// =========================================================

function randomStatus() {
  const value = random();

  if (value < 0.50) {
    return {
      publish:
        ActivityPublishStatus.PUBLISH,
      approve:
        ActivityApproveStatus.APPROVE,
    };
  }

  if (value < 0.60) {
    return {
      publish:
        ActivityPublishStatus.PUBLISH,
      approve:
        ActivityApproveStatus.PENDING,
    };
  }

  if (value < 0.65) {
    return {
      publish:
        ActivityPublishStatus.PUBLISH,
      approve:
        ActivityApproveStatus.REJECTED,
    };
  }

  if (value < 0.75) {
    return {
      publish:
        ActivityPublishStatus.UNPUBLISH,
      approve:
        ActivityApproveStatus.APPROVE,
    };
  }

  if (value < 0.80) {
    return {
      publish:
        ActivityPublishStatus.UNPUBLISH,
      approve:
        ActivityApproveStatus.PENDING,
    };
  }

  if (value < 0.83) {
    return {
      publish:
        ActivityPublishStatus.UNPUBLISH,
      approve:
        ActivityApproveStatus.REJECTED,
    };
  }

  if (value < 0.88) {
    return {
      publish:
        ActivityPublishStatus.DRAFT,
      approve:
        ActivityApproveStatus.APPROVE,
    };
  }

  if (value < 0.96) {
    return {
      publish:
        ActivityPublishStatus.DRAFT,
      approve:
        ActivityApproveStatus.PENDING,
    };
  }

  return {
    publish:
      ActivityPublishStatus.DRAFT,
    approve:
      ActivityApproveStatus.REJECTED,
  };
}

// =========================================================
// SCHEDULE COUNT
// =========================================================

function randomScheduleCount() {
  const value = random();

  // 30% = ไม่มี Schedule
  if (value < 0.30) {
    return 0;
  }

  // 35% = 1
  if (value < 0.65) {
    return 1;
  }

  // 25% = 2
  if (value < 0.90) {
    return 2;
  }

  // 8% = 3
  if (value < 0.98) {
    return 3;
  }

  // 2% = 4-5
  return randomInt(4, 5);
}

// =========================================================
// DATE
// =========================================================

function randomDate() {
  const year = randomInt(2025, 2027);
  const month = randomInt(0, 11);
  const day = randomInt(1, 25);

  const start = new Date(
    year,
    month,
    day,
    randomInt(8, 17),
    randomInt(0, 59),
    0
  );

  const durationDays = randomInt(1, 3);

  const end = new Date(start);

  end.setDate(
    end.getDate() + durationDays
  );

  end.setHours(
    randomInt(15, 21),
    randomInt(0, 59),
    0
  );

  return {
    start,
    end,
  };
}

// =========================================================
// PRICE
// =========================================================

function randomPrice() {
  // 45% ฟรี
  if (random() < 0.45) {
    return 0;
  }

  // 25 - 1500 บาท
  return randomInt(5, 300) * 5;
}

// =========================================================
// SCHEDULE
// =========================================================

async function createSchedules(
  activityId: number,
  count: number,
  activityStartDate: Date
) {
  for (let i = 0; i < count; i++) {
    const scheduleStart =
      new Date(activityStartDate);

    scheduleStart.setDate(
      scheduleStart.getDate() + i
    );

    scheduleStart.setHours(
      randomInt(8, 17),
      randomInt(0, 59),
      0,
      0
    );

    const scheduleEnd =
      new Date(scheduleStart);

    scheduleEnd.setHours(
      scheduleStart.getHours() +
        randomInt(1, 4)
    );

    const schedule =
      await prisma.activitySchedule.create({
        data: {
          activityId,

          title: `${randomItem([
            "กิจกรรมหลัก",
            "กิจกรรมเวิร์กช็อป",
            "กิจกรรมการแสดง",
            "กิจกรรมเรียนรู้",
            "กิจกรรมการแข่งขัน",
            "กิจกรรมสาธิต",
          ])} ครั้งที่ ${i + 1}`,

          description:
            randomItem(descriptions),

          startDateTime: scheduleStart,

          endDateTime: scheduleEnd,
        },
      });

    // =====================================================
    // Schedule มีรูปเดียว
    // =====================================================

    await prisma.activityScheduleFile.create({
      data: {
        scheduleId: schedule.id,
        filePath: DEFAULT_SCHEDULE_IMAGE,
        type: ImageType.COVER,
      },
    });
  }
}

// =========================================================
// ACTIVITIES
// =========================================================

async function createActivities(
  locations: Awaited<
    ReturnType<typeof createLocations>
  >,
  users: Awaited<
    ReturnType<typeof createUsers>
  >
) {
  for (let i = 1; i <= 200; i++) {
    // สุ่ม Location จากทั้ง 77 จังหวัด
    const location =
      randomItem(locations);

    const creator =
      random() < 0.7
        ? users.admin
        : users.superAdmin;

    const theme =
      randomItem(themes);

    const activityType =
      randomItem(activityTypes);

    const dates = randomDate();

    const status =
      randomStatus();

    const scheduleCount =
      randomScheduleCount();

    const activity =
      await prisma.activity.create({
        data: {
          locationId: location.id,

          createById: creator.id,

          name: `${theme} ครั้งที่ ${i}`,

          tagline:
            randomItem(taglines),

          description:
            randomItem(descriptions),

          activityType,

          phone: `08${randomInt(
            10000000,
            99999999
          )}`,

          lineUrl:
            "https://line.me/",

          facebookUrl:
            "https://www.facebook.com/",

          price:
            randomPrice(),

          statusActivity:
            status.publish,

          statusApprove:
            status.approve,

          startDate:
            dates.start,

          dueDate:
            dates.end,

          rejectReason:
            status.approve ===
            ActivityApproveStatus.REJECTED
              ? "ข้อมูลกิจกรรมไม่ครบถ้วน กรุณาตรวจสอบและแก้ไขข้อมูล"
              : null,

          updatedById:
            random() < 0.5
              ? users.admin.id
              : users.superAdmin.id,

          isDeleted: false,

          viewCount:
            randomInt(0, 5000),
        },
      });

    // =====================================================
    // ACTIVITY FILES
    //
    // ทุก Activity มี:
    // 1 Cover
    // 1 Gallery
    // 1 Video
    //
    // แต่ใช้ไฟล์จริงร่วมกัน
    // =====================================================

    await prisma.activityFile.createMany({
      data: [
        {
          activityId: activity.id,

          filePath:
            DEFAULT_ACTIVITY_COVER,

          type: ImageType.COVER,
        },

        {
          activityId: activity.id,

          filePath:
            DEFAULT_ACTIVITY_GALLERY,

          type: ImageType.GALLERY,
        },

        {
          activityId: activity.id,

          filePath:
            DEFAULT_ACTIVITY_VIDEO,

          type: ImageType.VIDEO,
        },
      ],
    });

    // =====================================================
    // SCHEDULE
    // =====================================================

    if (scheduleCount > 0) {
      await createSchedules(
        activity.id,
        scheduleCount,
        dates.start
      );
    }

    console.log(
      `✅ Activity ${i}/200 | ${location.province} | Schedule: ${scheduleCount}`
    );
  }
}

// =========================================================
// MAIN
// =========================================================

async function main() {
  console.log("");
  console.log(
    "======================================"
  );
  console.log("🌱 START SEEDING");
  console.log(
    "======================================"
  );

  // =======================================================
  // CLEAN OLD DATA
  // =======================================================

  console.log(
    "🧹 Cleaning old data..."
  );

  await prisma.activityScheduleFile.deleteMany();

  await prisma.activityFile.deleteMany();

  await prisma.activitySchedule.deleteMany();

  await prisma.activity.deleteMany();

  await prisma.location.deleteMany();

  await prisma.banner.deleteMany();

  await prisma.user.deleteMany();

  await prisma.role.deleteMany();

  console.log(
    "✅ Old data cleaned"
  );

  // =======================================================
  // USERS
  // =======================================================

  console.log(
    "👤 Creating users..."
  );

  const users =
    await createUsers();

  // =======================================================
  // LOCATIONS
  // =======================================================

  console.log(
    `📍 Creating ${provinces.length} provinces...`
  );

  const locations =
    await createLocations();

  // =======================================================
  // BANNERS
  // =======================================================

  console.log(
    "🖼️ Creating banners..."
  );

  await createBanners();

  // =======================================================
  // ACTIVITIES
  // =======================================================

  console.log(
    "🎯 Creating 200 activities..."
  );

  await createActivities(
    locations,
    users
  );

  // =======================================================
  // SUMMARY
  // =======================================================

  const userCount =
    await prisma.user.count();

  const roleCount =
    await prisma.role.count();

  const locationCount =
    await prisma.location.count();

  const bannerCount =
    await prisma.banner.count();

  const activityCount =
    await prisma.activity.count();

  const scheduleCount =
    await prisma.activitySchedule.count();

  const activityFileCount =
    await prisma.activityFile.count();

  const scheduleFileCount =
    await prisma.activityScheduleFile.count();

  console.log("");
  console.log(
    "======================================"
  );
  console.log("🎉 SEED COMPLETE");
  console.log(
    "======================================"
  );

  console.log(
    `👤 Users           : ${userCount}`
  );

  console.log(
    `🔐 Roles           : ${roleCount}`
  );

  console.log(
    `📍 Locations       : ${locationCount}`
  );

  console.log(
    `🖼️ Banners         : ${bannerCount}`
  );

  console.log(
    `🎯 Activities      : ${activityCount}`
  );

  console.log(
    `📅 Schedules       : ${scheduleCount}`
  );

  console.log(
    `🖼️ Activity Files  : ${activityFileCount}`
  );

  console.log(
    `🖼️ Schedule Files  : ${scheduleFileCount}`
  );

  console.log("");
  console.log(
    "======================================"
  );
  console.log("🔐 LOGIN");
  console.log(
    "======================================"
  );

  console.log("");
  console.log("Super Admin");
  console.log("username: superadmin");
  console.log("password: 123456");

  console.log("");
  console.log("Admin");
  console.log("username: admin");
  console.log("password: 123456");

  console.log("");
  console.log(
    "======================================"
  );
  console.log("📁 SHARED FILES");
  console.log(
    "======================================"
  );

  console.log(
    `Cover    : ${DEFAULT_ACTIVITY_COVER}`
  );

  console.log(
    `Gallery  : ${DEFAULT_ACTIVITY_GALLERY}`
  );

  console.log(
    `Video    : ${DEFAULT_ACTIVITY_VIDEO}`
  );

  console.log(
    `Schedule : ${DEFAULT_SCHEDULE_IMAGE}`
  );

  console.log(
    "======================================"
  );
}

// =========================================================
// RUN
// =========================================================

main()
  .catch((error) => {
    console.error("");
    console.error(
      "❌ SEED ERROR"
    );
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });