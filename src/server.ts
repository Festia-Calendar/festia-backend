import express from "express";
import rootRouter from "./Routes/index-routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3000;

// API
app.use("/api", rootRouter);

// Swagger API Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static uploads
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

/*
 * คำอธิบาย : เริ่มต้น Server
 * Input : ไม่มี
 * Output : เปิด HTTP Server ที่ port ที่กำหนด
 */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});