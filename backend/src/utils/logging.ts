import { Request, Response } from "express";
export default function (req: Request, res: Response, next: Function): void {
  const log = `\n[${new Date().toUTCString()}] - ${req.hostname} - ${
    req.method
  } ${req.originalUrl}`;
  console.log(log);
  next();
}
