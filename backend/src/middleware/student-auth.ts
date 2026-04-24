import type { NextFunction, Request, Response } from "express";
import { AppError } from "./error-handler.js";

const STUDENT_EMAIL_REGEX = /@([a-z0-9.-]+\.)?(edu\.in|ac\.in)$/i;

export function requireStudentVerification(req: Request, _res: Response, next: NextFunction) {
  const studentId = req.header("x-student-id");
  const studentEmail = req.header("x-student-email");

  if (!studentId || !studentEmail) {
    return next(new AppError(401, "Missing student verification headers"));
  }

  if (!STUDENT_EMAIL_REGEX.test(studentEmail)) {
    return next(new AppError(403, "Only verified college domains are allowed"));
  }

  return next();
}
