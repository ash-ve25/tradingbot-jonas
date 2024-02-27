import { JWT_ACCESS_KEY } from '../config';
import { Payload, RequestWithPayload } from '../interface/shared/request.interface';
import { ErrorResponse } from '../utils/common';
import { logger } from '../utils/logger';
import { NextFunction, Response } from 'express';
import JWT from 'jsonwebtoken';
import createHttpError from 'http-errors';

class TokenService {
  data: any;
  private next!: NextFunction;
  secret = JWT_ACCESS_KEY!;
  public async signAccessToken(userId: any, role: String): Promise<any> {
    try {
      const payload = {
        userId: userId,
      };
      const options = {
        expiresIn: '7d',
        issuer: 'Secvolt-Screener',
      };
      const token = JWT.sign(payload, this.secret, options);
      return token;
    } catch (error) {
      console.error(error);
      logger.error(error);
    }
  }

  public verifyAccessToken(isAdmin = false) {
    return (req: RequestWithPayload, res: Response, next: NextFunction) => {
      if (!req.headers['authorization']) return ErrorResponse(res, 401, 'Unauthorized');
      const authHeader = req.headers['authorization'];
      const bearerToken = authHeader.split(' ');
      const token = bearerToken[1];
      JWT.verify(token, this.secret, (err: any, payload: Payload | any) => {
        if (err) {
          const message = err.name === 'TokenExpiredError' ? 'Session Expired' : err.message;
          next(new createHttpError.Unauthorized(message!));
        }
        req.payload = payload;
        if (payload && isAdmin && payload.role && payload.role != 'admin') {
          next(new createHttpError.Unauthorized('Only Admin Can Access This Route'));
        } else if (payload && !isAdmin && payload.role && payload.role != 'user') {
          next(new createHttpError.Unauthorized('Only User Can Access This Route'));
        }
        next();
      });
    };
  }
}

export default TokenService;
