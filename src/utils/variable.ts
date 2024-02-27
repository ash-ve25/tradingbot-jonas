import { ACCESS_KEY, BINANCE_ACCESS_KEY, BINANCE_SECRET_KEY, SECRET_KEY } from '@/config';

export const ApiV1 = '/api/v1';
export const ApiV2 = '/api/v2';
export const ApiEndpoints = {
  getAllCoins: 'https://quantifycrypto.com/api/v1/coins',
  getCoinMetadataBySymbol: `https://quantifycrypto.com/api/v1.0/common/?currency=USD&qc_key=`,
  getCoinInfoBySymbol: `https://quantifycrypto.com/api/v1/coins`,
  getCoinIndicators: `https://quantifycrypto.com/api/v1/indicators`,
  binance: {
    createOrder: `https://testnet.binancefuture.com/fapi/v1/order?signature`,
    getOrders: `https://testnet.binancefuture.com/fapi/v1/allOrders?signature`,
    getAllOpenOrders: `https://testnet.binancefuture.com/fapi/v1/openOrders`,
  },
  phemex: {
    API_URL: `https://testnet-api.phemex.com`,
    MARKETS: `/v1/exchange/public/products`,
    ORDERBOOK: `/md/orderbook`,
    TRADES: `/md/trade`,
    SETLEVERAGES: `/positions/leverage`,

    ORDER_ACTIVE_LIST: `/orders/activeList`,
    ORDER_PLACE: `/orders`,
    ORDER_CANCEL: `/orders/cancel`,
  },
};
export const headers = {
  'QC-Access-Key': ACCESS_KEY,
  'QC-Secret-Key': SECRET_KEY,
};
export const binanceHeaders = {
  'X-MBX-APIKEY': BINANCE_ACCESS_KEY,
};
