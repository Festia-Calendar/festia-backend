import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Festia API",
      version: "1.0.0",
      description: "API Documentation สำหรับระบบ Festia",
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Local Development",
      },
    ],

    tags: [
      {
        name: "Activity - SuperAdmin",
        description: "API สำหรับจัดการกิจกรรมโดย SuperAdmin",
      },
      {
        name: "Activity - Admin",
        description: "API สำหรับจัดการกิจกรรมโดย Admin",
      },
      {
        name: "Activity - Home",
        description: "API สำหรับแสดงกิจกรรมสำหรับผู้ใช้งานทั่วไป",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "กรอก JWT Token",
        },
      },
    },
  },

  apis: [
    "./src/Routes/**/*.ts",
  ],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);