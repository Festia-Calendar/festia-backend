import express from "express";
import rootRouter from "./Routes/index-routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3000;
app.use("/api", rootRouter);


// ถ้าใช้ ES Modules (type: "module") ให้ใช้ 2 บรรทัดนี้ช่วยหาพาทปัจจุบัน
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ชี้เป้าไปที่โฟลเดอร์ uploads ที่อยู่ด้านนอก src ให้ชัดเจน
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/*
 * คำอธิบาย : เริ่มต้น Server
 * Input : ไม่มี
 * Output : เปิด HTTP Server ที่ port ที่กำหนด
 */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
