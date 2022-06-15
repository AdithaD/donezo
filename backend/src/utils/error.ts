import type { Request, Response } from "express";

/**
 * An error in the API
 * @author AdithaD
 */
export class APIError {
  type: string;
  message?: string;
  detail: string;
  status: number;

  instance: string;

  constructor(type: ErrorType, req: Request, message?: string) {
    let data = errors[type];
    this.type = type;
    this.message = message;
    this.detail = data.detail;
    this.status = data.status;

    this.instance = `${req.method} ${req.originalUrl}`;
  }

  toJson() {
    return {
      type: this.type,
      message: this.message,
      detail: this.detail,
      instance: this.instance,
    };
  }

  sendResponse(res: Response) {
    console.log(this.toJson());
    res.status(this.status).send(this.toJson());
  }
}

export type ErrorType =
  | "BadRequestError"
  | "NotFoundError"
  | "UnauthorizedError"
  | "UnauthenticatedError"
  | "ForbiddenError"
  | "UnprocessableError"
  | "InternalError"
  | "ConflictError";

const errors: {
  [key in ErrorType]: { message: string; detail: string; status: number };
} = {
  BadRequestError: {
    message: "Bad Request",
    detail:
      "The request could not be understood by the server due to malformed syntax.",
    status: 400,
  },
  NotFoundError: {
    message: "Not Found",
    detail: "The requested resource could not be found.",
    status: 404,
  },
  ForbiddenError: {
    message: "Forbidden",
    detail:
      "The request was a valid request, but the server is refusing to respond to it.",
    status: 403,
  },
  UnauthorizedError: {
    message: "Forbidden",
    detail: "The request is not authorised to conduct this operation.",
    status: 403,
  },
  InternalError: {
    message: "Internal Server Error",
    detail:
      "The server encountered an unexpected condition which prevented it from fulfilling the request.",
    status: 500,
  },
  UnprocessableError: {
    message: "Unprocessable Entity",
    detail:
      "The request was well-formed but was unable to be followed due to semantic errors.",
    status: 422,
  },
  ConflictError: {
    message: "Conflict",
    detail:
      "The request could not be completed due to a conflict with the current state of the resource.",
    status: 409,
  },
  UnauthenticatedError: {
    message: "Unauthenticated",
    detail: "The request requires user authentication.",
    status: 401,
  },
};

export function handleSqlError(
  name: string,

  error: any,
  req: Request,
  res: Response,
  foreign?: string
) {
  console.log(error);
  if (error.code) {
    switch (error.code as string) {
      case "SQLITE_CONSTRAINT_UNIQUE":
        new APIError(
          "ConflictError",
          req,
          `${name} already exists`
        ).sendResponse(res);
        break;
      case "SQLITE_CONSTRAINT_FOREIGNKEY":
        new APIError(
          "ConflictError",
          req,
          `${foreign ?? ""} does not exist`
        ).sendResponse(res);
        break;
      default:
        new APIError(
          "InternalError",
          req,
          "Internal Server Error"
        ).sendResponse(res);
        break;
    }
  } else {
    new APIError("InternalError", req, "Internal Server Error").sendResponse(
      res
    );
  }
}
