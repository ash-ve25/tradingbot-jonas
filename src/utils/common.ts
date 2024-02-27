import { logger } from './logger';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { NODE_ENV } from '@/config';

export function logError(req: Request, statusCode: number, message: string) {
  logger.error(`[${req.method}] [${req.ip}] ${req.path} >> StatusCode:: ${statusCode}, Message:: ${message}`);
}

export function logInfo(req: Request | any, statusCode: number, message: string, data: any = {}) {
  logger.info(
    `[${req?.method}] [${req?.ip}] 
    ${req?.path} >> StatusCode:: ${statusCode}, Message:: ${message} Data:: ${JSON.stringify(data)}`,
  );
  // logger.info(
  //   `{
  //     method : ${req.method},
  //     ip : ${req.ip},
  //     path : ${req.path},
  //     statusCode : ${statusCode},
  //     message : ${message},
  //     data : ${JSON.stringify(data)
  //   }`,
  // );
}
export function getdate() {
  var currentdate = new Date();
  var datetime = currentdate.getDate() + '-' + (currentdate.getMonth() + 1) + '-' + currentdate.getFullYear();
  return datetime;
}

export function DataResponse(
  req: Request,
  res: Response,
  statusCode: number,
  message: string,
  totalCount = 1,
  data: any,
  params: any = {},
) {
  if (NODE_ENV == 'production') {
    logInfo(req, res.statusCode, message, data);
  }
  return res.status(statusCode).json({
    statusCode: statusCode,
    message: message.toLowerCase(),
    params: params,
    totalCount: totalCount,
    data: data,
  });
}
const EXPIRETIME = 86400;

export const BAD_REQUEST = '400_BAD_REQUEST';

export function ErrorResponse(res: Response, statusCode: number, message: string) {
  return res.status(statusCode).json({
    error: {
      message: message.toLowerCase(),
    },
  });
}

export function ErrorValidations(res: Response, req: Request, code: number) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // if (NODE_ENV == 'development') {
    //   logError(
    //     req,
    //     code,
    //     JSON.stringify({
    //       message: 'Please Fill All Details Correctly',
    //       errors: errors.array(),
    //     }),
    //   );
    // }
    return res.status(code).json({
      error: {
        message: 'Please Fill All Details Correctly',
        errors: errors.array(),
      },
    });
  }
}

export function CheckErrors(req: Request) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return true;
  } else {
    return false;
  }
}
