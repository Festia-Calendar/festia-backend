import express from "express";
import rootRouter from "./Routes/index-routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3000;
app.use("/api", rootRouter);

/*
 * คำอธิบาย : เริ่มต้น Server
 * Input : ไม่มี
 * Output : เปิด HTTP Server ที่ port ที่กำหนด
 */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});