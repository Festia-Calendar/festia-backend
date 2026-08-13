/**
 * คำอธิบาย : Service สำหรับจัดการ Authentication
 * รับผิดชอบการตรวจสอบข้อมูลผู้ใช้และสร้าง JWT
 */

import bcrypt from "bcrypt";
import prisma from "../database-service.js";
import { generateToken } from "../../Libs/token.js";
import { LoginDto } from "./auth-dto.js";

export async function login(
  body: LoginDto,
  ip: string,
  expirationSeconds: number
) {
  const user = await prisma.user.findUnique({
    where: {
      username: body.username,
    },
    include: {
      role: true,
    },
  });

  if (!user) {
    throw new Error("Username หรือ Password ไม่ถูกต้อง");
  }

  if (user.isDeleted) {
    throw new Error("บัญชีผู้ใช้นี้ถูกลบ");
  }

  if (user.status === "BLOCKED") {
    throw new Error("บัญชีผู้ใช้นี้ถูกระงับ");
  }

  const isPasswordCorrect = await bcrypt.compare(
    body.password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Username หรือ Password ไม่ถูกต้อง");
  }

  const token = generateToken(
    {
      id: user.id,
      username: user.username,
      role: user.role.name,
    },
    expirationSeconds
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fname: user.fname,
      lname: user.lname,
      role: user.role.name,
    },
  };
}

export async function logout() {
  return {
    cookie: {
      name: "accessToken",
      options: {
        httpOnly: true,
        secure: false,
        sameSite: "lax" as const,
      },
    },
  };
}

export async function getProfile(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    fname: user.fname,
    lname: user.lname,
    role: user.role.name,
  };
}