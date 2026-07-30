import "express";

declare global {
  namespace Express {
    interface UserPayload {
      id: number;
      role: string;
      username: string;
      email: string;
    }

    interface Request {
      user: UserPayload;
    }
  }
}

export {};