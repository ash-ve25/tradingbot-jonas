import { Routes } from "@/interface/shared/routes.interface";
import { ApiV1 } from "@/utils/variable";
import { CHECK_ADMIN } from "@/validations/authvalidtion";
import { Router } from "express";
import AuthController from "./auth.controller";


class AuthRoute implements Routes {
  public path = '/auth';
  public admin = '/admin';
  public router = Router();
  public authController = new AuthController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${ApiV1}${this.admin}${this.path}/login`, CHECK_ADMIN(true), this.authController.adminLogin);
    this.router.post(`${ApiV1}${this.admin}${this.path}/signup`, CHECK_ADMIN(false), this.authController.adminSignup);
  }
}
export default AuthRoute;
