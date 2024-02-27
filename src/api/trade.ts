//@ts-nocheck
import { ApiEndpoints } from './../utils/variable';
import { phemexDelRequest, phemexGetRequest, phemextPostRequest, phemextPutRequest } from '@/utils/http';
import { buildUUID } from '@/utils/uuid';

export function loadActiveOrders(symbol) {
  return phemexGetRequest(ApiEndpoints.phemex.ORDER_ACTIVE_LIST, symbol);
}

export function placeOrder({
  symbol,
  side,
  orderQty,
  ordType,
  postOnly = false,
  reduceOnly = false,
  timeInForce = 'GoodTillCancel',
}) {
  const params = {
    clOrdID: buildUUID(),
    symbol,
    side,
    orderQty,
    ordType,
    postOnly,
    reduceOnly,
    timeInForce,
  };
  return phemextPostRequest(ApiEndpoints.phemex.ORDER_PLACE, { params });
}

export function cancelOrder(symbol, orderID) {
  return phemexDelRequest(ApiEndpoints.phemex.ORDER_CANCEL, { query: { symbol, orderID } });
}
export function setLeverage(symbol, leverage = 10) {
  return phemextPutRequest(ApiEndpoints.phemex.SETLEVERAGES, {
    query: {
      leverage: leverage,
      symbol: symbol,
    },
  });
}
