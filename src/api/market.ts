import { ApiEndpoints } from './../utils/variable';
import { phemexGetRequest } from '@/utils/http';

export function loadMarket() {
  return phemexGetRequest(ApiEndpoints.phemex.MARKETS, { query: {} });
}

export function loadOrderbook(symbol) {
  return phemexGetRequest(ApiEndpoints.phemex.ORDERBOOK, { query: { symbol, id: 1 } });
}

export function loadTrades(symbol) {
  return phemexGetRequest(ApiEndpoints.phemex.TRADES, {query: {symbol}});
}
