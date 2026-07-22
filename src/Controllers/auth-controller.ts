/*
 * คำอธิบาย : Controller สำหรับจัดการ Authentication
 */

import type { Request, Response } from "express";
import * as AuthService from "../Services/auth-service";
import {
  createErrorResponse,
  createResponse,
} from "../Libs/createResponse";

export const JWT_EXPIRATION_SECONDS = 24 * 60 * 60;

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await AuthService.login(
      req.body,
      req.ip ?? "",
      JWT_EXPIRATION_SECONDS
    );

    res.cookie("accessToken", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: JWT_EXPIRATION_SECONDS * 1000,
    });

    return createResponse(
      res,
      200,
      "Login successful",
      result
    );
  } catch (error) {
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
};

export const logout = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await AuthService.logout();

    res.clearCookie(
      result.cookie.name,
      result.cookie.options
    );

    return createResponse(
      res,
      200,
      "Logout successful"
    );
  } catch (error) {
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );
  }
};

export const me = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await AuthService.getProfile(
      req.user.id
    );
    return createResponse(
      res,
      200,
      "check successful",
      user
    );
  } catch (error) {
    return createErrorResponse(
      res,
      400,
      (error as Error).message
    );

  }
};