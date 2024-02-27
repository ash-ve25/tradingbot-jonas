import { Routes } from '@/interface/shared/routes.interface';
import { ApiV1 } from '@/utils/variable';
import { Router } from 'express';
import TokenService from '../../services/token.service';
import TradingPairController from './tradingpair.controller';

class TradingPairRoute implements Routes {
  public path = '/amount';
  public admin = '/admin';
  public router = Router();
  public controller = new TradingPairController();
  public tokenService = new TokenService();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${ApiV1}${this.path}`, this.tokenService.verifyAccessToken(true), this.controller.getall);
    this.router.post(`${ApiV1}${this.path}`, this.tokenService.verifyAccessToken(true), this.controller.create);
    this.router.patch(`${ApiV1}${this.path}/:id`, this.tokenService.verifyAccessToken(true), this.controller.update);
    this.router.delete(`${ApiV1}${this.path}/:id`, this.tokenService.verifyAccessToken(true), this.controller.delete);
  }
}
export default TradingPairRoute;
