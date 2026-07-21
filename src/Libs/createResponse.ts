import type { Response } from "express";
import { v4 as uuidv4 } from "uuid";


export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,

  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,

  INTERNAL_SERVER_ERROR = 500,
}


export type ValidResponse = {
  status: HttpStatusCode;
  error: false;
  message: string;
  data?: unknown;
};


export type ErrorResponse = {
  status: HttpStatusCode;
  error: true;
  message: string;
  data?: unknown;
  errorId: string;
  errors?: unknown;
};


export type StandardResponse =
  | ValidResponse
  | ErrorResponse;



export const createResponse = (
  res: Response,
  status: HttpStatusCode,
  message: string,
  data?: unknown
): ValidResponse => {

  const response: ValidResponse = {
    status,
    error: false,
    message,
    ...(data !== undefined ? { data } : {}),
  };

  res.status(status).json(response);

  return response;
};



export const createErrorResponse = (
  res: Response,
  status: HttpStatusCode,
  message: string,
  data?: unknown,
  errorId?: string,
  errors?: unknown
): ErrorResponse => {

  const response: ErrorResponse = {
    status,
    error: true,
    message,
    ...(data !== undefined ? { data } : {}),
    errorId: errorId ?? uuidv4(),
    ...(errors !== undefined ? { errors } : {}),
  };


  res.status(status).json(response);

  return response;
};