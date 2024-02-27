import validateEnv from './utils/validateEnv';
import App from './app';
import AuthRoute from './module/auth/auth.route';
import TradingRoute from './module/trading/trading.route';
import TradingPairRoute from './module/amount/tradingpair.route';

validateEnv();

const app = new App([new AuthRoute(), new TradingRoute(), new TradingPairRoute()]);

//Listen
app.listen();
