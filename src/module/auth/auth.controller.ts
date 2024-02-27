import { CheckErrors, DataResponse, ErrorResponse, ErrorValidations } from '@/utils/common';
import { NextFunction, Request, Response } from 'express';
import AuthService from './auth.service';

class JsonController {
  private adminservice = new AuthService();
  public adminLogin = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      let checkErrorExist = CheckErrors(req);
      if (checkErrorExist) return ErrorValidations(res, req, 422);
      const data = await this.adminservice.adminLogin(req.body);
      DataResponse(req, res, 200, 'Success', 1, data);
    } catch (error) {
      next(error);
    }
  };
  public adminSignup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let checkErrorExist = CheckErrors(req);
      if (checkErrorExist) return ErrorValidations(res, req, 422);
      const data = await this.adminservice.adminSignup(req.body);
      DataResponse(req, res, 200, 'Success', 1, data);
    } catch (error) {
      next(error);
    }
  };

}

export default JsonController;
