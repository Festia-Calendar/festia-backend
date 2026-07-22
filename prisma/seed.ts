import {
  PrismaClient,
  Gender,
  UserStatus,
  ActivityPublishStatus,
  ActivityApproveStatus,
  ActivityType,
} from "@prisma/client";

import bcrypt from "bcrypt";


const prisma = new PrismaClient();



async function main() {


  console.log("🌱 Start seed...");



  // =========================
  // ROLE
  // =========================

  const superAdminRole =
    await prisma.role.upsert({

      where:{
        name:"SUPERADMIN"
      },

      update:{},

      create:{
        name:"SUPERADMIN"
      }

    });



  const adminRole =
    await prisma.role.upsert({

      where:{
        name:"ADMIN"
      },

      update:{},

      create:{
        name:"ADMIN"
      }

    });




  // =========================
  // USER
  // =========================


  const password =
    await bcrypt.hash(
      "123456",
      10
    );



  const superAdmin =
    await prisma.user.create({

      data:{

        roleId:
          superAdminRole.id,

        username:
          "superadmin",

        email:
          "superadmin@festia.com",

        password,

        fname:
          "สมชาย",

        lname:
          "ผู้ดูแลระบบ",

        phone:
          "0800000001",

        gender:
          Gender.MALE,

        status:
          UserStatus.ACTIVE

      }

    });




  const admin =
    await prisma.user.create({

      data:{

        roleId:
          adminRole.id,

        username:
          "admin",

        email:
          "admin@festia.com",

        password,

        fname:
          "วิภา",

        lname:
          "ผู้จัดกิจกรรม",

        phone:
          "0800000002",

        gender:
          Gender.FEMALE,

        status:
          UserStatus.ACTIVE

      }

    });




  const guest =
    await prisma.user.create({

      data:{

        roleId:
          adminRole.id,

        username:
          "guest",

        email:
          "guest@festia.com",

        password,

        fname:
          "Guest",

        lname:
          "User",

        phone:
          "0800000003",

        gender:
          Gender.NONE,

        status:
          UserStatus.ACTIVE

      }

    });




  // =========================
  // LOCATION
  // =========================


  const location =
    await prisma.location.create({

      data:{

        name:
          "ศูนย์ประชุมแห่งชาติสิริกิติ์",

        zone:
          "กรุงเทพมหานคร",

        province:
          "กรุงเทพมหานคร",

        district:
          "คลองเตย",

        subDistrict:
          "คลองเตย",

        detail:
          "สถานที่จัดกิจกรรมและนิทรรศการขนาดใหญ่",

        latitude:
          13.7245,

        longitude:
          100.5595

      }

    });





  // =========================
  // ACTIVITY DATA
  // =========================


  const activities = [


    {
      name:
        "ประเพณีสงกรานต์พระประแดง 2569",

      tagline:
        "สืบสานวัฒนธรรมไทย วิถีชาวมอญ",

      description:
        "งานประเพณีสงกรานต์พระประแดง พบกับขบวนแห่ การละเล่นพื้นบ้าน และกิจกรรมวัฒนธรรม",

      type:
        ActivityType.CULTURAL_FESTIVAL,

      publish:
        ActivityPublishStatus.PUBLISH,

      approve:
        ActivityApproveStatus.APPROVE,

      price:0

    },



    {
      name:
        "Bangkok Art Biennale 2026",

      tagline:
        "เทศกาลศิลปะร่วมสมัยนานาชาติ",

      description:
        "นิทรรศการศิลปะจากศิลปินไทยและต่างประเทศ",

      type:
        ActivityType.EXHIBITION_ART,

      publish:
        ActivityPublishStatus.PUBLISH,

      approve:
        ActivityApproveStatus.APPROVE,

      price:200

    },



    {
      name:
        "Thailand Music Festival 2026",

      tagline:
        "มหกรรมดนตรีกลางแจ้ง",

      description:
        "เทศกาลดนตรีรวมศิลปินไทยและต่างประเทศ",

      type:
        ActivityType.PERFORMANCE_MUSIC,

      publish:
        ActivityPublishStatus.PUBLISH,

      approve:
        ActivityApproveStatus.APPROVE,

      price:1500

    },



    {
      name:
        "เทศกาลอาหารทะเลบางแสน 2569",

      tagline:
        "รวมอาหารทะเลชื่อดัง",

      description:
        "เทศกาลอาหารทะเลและกิจกรรมชุมชนริมชายหาด",

      type:
        ActivityType.FOOD_DRINK_FESTIVAL,

      publish:
        ActivityPublishStatus.PUBLISH,

      approve:
        ActivityApproveStatus.APPROVE,

      price:0

    },



    {
      name:
        "Art & Craft Weekend Market",

      tagline:
        "ตลาดงานสร้างสรรค์",

      description:
        "ตลาดรวมสินค้า Handmade และสินค้าท้องถิ่น",

      type:
        ActivityType.MARKET_FAIR,

      publish:
        ActivityPublishStatus.UNPUBLISH,

      approve:
        ActivityApproveStatus.PENDING,

      price:0

    },



    {
      name:
        "อบรม Digital Marketing สำหรับ SME",

      tagline:
        "เพิ่มยอดขายด้วยโลกออนไลน์",

      description:
        "อบรมการสร้างแบรนด์ การตลาดออนไลน์ และ Content Marketing",

      type:
        ActivityType.TRAINING_SEMINAR,

      publish:
        ActivityPublishStatus.DRAFT,

      approve:
        ActivityApproveStatus.PENDING,

      price:500

    },



    {
      name:
        "Pattaya Beach Sport Festival",

      tagline:
        "มหกรรมกีฬาริมชายหาด",

      description:
        "การแข่งขันกีฬาและกิจกรรมนันทนาการริมทะเล",

      type:
        ActivityType.SPORT_RECREATION,

      publish:
        ActivityPublishStatus.UNPUBLISH,

      approve:
        ActivityApproveStatus.REJECTED,

      price:100

    },



    {
      name:
        "เที่ยวชุมชนบ้านเชียง วิถีอีสาน",

      tagline:
        "เรียนรู้วัฒนธรรมท้องถิ่น",

      description:
        "กิจกรรมท่องเที่ยวชุมชน เรียนรู้ภูมิปัญญาและอาหารพื้นบ้าน",

      type:
        ActivityType.COMMUNITY_TOURISM,

      publish:
        ActivityPublishStatus.DRAFT,

      approve:
        ActivityApproveStatus.PENDING,

      price:800

    }

  ];






  // =========================
  // CREATE ACTIVITY
  // =========================


  for(
    const item of activities
  ){


    const activity =
      await prisma.activity.create({

        data:{

          locationId:
            location.id,


          createById:
            admin.id,


          name:
            item.name,


          tagline:
            item.tagline,


          description:
            item.description,


          activityType:
            item.type,


          phone:
            "0812345678",


          lineUrl:
            "https://line.me/ti/p/@festia",


          facebookUrl:
            "https://facebook.com/festia",


          price:
            item.price,


          statusActivity:
            item.publish,


          statusApprove:
            item.publish === ActivityPublishStatus.DRAFT
            ? ActivityApproveStatus.PENDING
            : item.approve,


          startDate:
            new Date("2026-04-10"),


          dueDate:
            new Date("2026-04-12"),


          updatedById:
            admin.id


        }

      });




    // =========================
    // SCHEDULE
    // =========================


    await prisma.activitySchedule.createMany({

      data:[

        {

          activityId:
            activity.id,

          title:
            "พิธีเปิดกิจกรรม",

          description:
            "เริ่มกิจกรรมและกล่าวต้อนรับผู้เข้าร่วม",

          startDateTime:
            new Date(
              "2026-04-10T09:00:00"
            ),

          endDateTime:
            new Date(
              "2026-04-10T10:00:00"
            )

        },


        {

          activityId:
            activity.id,

          title:
            "กิจกรรมหลัก",

          description:
            "ดำเนินกิจกรรมตามกำหนดการ",

          startDateTime:
            new Date(
              "2026-04-10T13:00:00"
            ),

          endDateTime:
            new Date(
              "2026-04-10T17:00:00"
            )

        }

      ]

    });


  }




  console.log(
    "✅ Seed completed"
  );

}



main()

.catch((error)=>{

 console.error(error);

 process.exit(1);

})

.finally(async()=>{

 await prisma.$disconnect();

});