import { Routes } from '@/interface/shared/routes.interface';
import { ApiV1 } from '@/utils/variable';
import { Router } from 'express';
import TradingController from './trading.controller';

class TradingRoute implements Routes {
  public path = '/text';
  public admin = '/admin';
  public router = Router();
  public controller = new TradingController();  
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${ApiV1}${this.path}/all`, this.controller.getall);
    this.router.post(`${ApiV1}${this.path}/binance/:symbol`, this.controller.setText);
    this.router.post(`${ApiV1}${this.path}/binance-close`, this.controller.closePositions);
    this.router.get(`${ApiV1}${this.path}/binance`, this.controller.getText);
    this.router.get(`${ApiV1}${this.path}/binance/account`, this.controller.getAccountInfo);
    // this.router.get(`${ApiV1}${this.path}/binance/trade-checker`, this.controller.tradeChecker);    
    this.router.get(`${ApiV1}${this.path}/binance/order-history`, this.controller.orderHistory);    
  }
}
export default TradingRoute;
