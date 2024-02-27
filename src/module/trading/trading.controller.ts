import { BINANCE_ACCESS_KEY, BINANCE_SECRET_KEY} from '@/config';
import { CheckErrors, DataResponse, ErrorValidations, getdate, logInfo } from '@/utils/common';
import { NextFunction, Request, Response } from 'express';
import {readFile } from 'fs';
import createHttpError from 'http-errors';
import Binance from 'node-binance-api';
import path from 'path';
import Orderchema from './../../models/order.model';
import OrderHistorychema from '@/models/order-history';
import mysql from 'mysql2';
import { forEach } from 'lodash';

class TradingController {
  
  binance: Binance = new Binance().options({
    APIKEY: BINANCE_ACCESS_KEY,
    APISECRET: BINANCE_SECRET_KEY,
    // test: NODE_ENV == 'local' ? true : false,
    test: true,
  });  

  dbConfig = {
    host: '38.242.242.82',
    user: 'dbuser',
    password: 'A2Q8J7dCSNvkEM!25',
    database: 'tradeDb'
  }
  //Method to check the account information for each trade pair(if exist)
  public getAccountInfo = async (req: Request | any, res: Response, next: NextFunction) => {    
    
    const pool = mysql.createPool(this.dbConfig);
    pool.getConnection((err, connection) => {
      let sql = 'SELECT count(*) FROM master_traders where is_trade_open=0 and follower_count > 0';
      if (err) {
        console.log('query connec error!', err);        
      } else {
        connection.query(sql, (err, results) => {
          if (err) {            
          } else {
            console.log(results);
          }
        });
      }
    })
    // let response = await this.binance.futuresOrderStatus('LTCUSDT',{orderId: 521389596});
    let response = await this.binance.futuresAccount();
    console.log("balance:", response.availableBalance);
    DataResponse(req, res, 200, 'Success', 1, response);
  };
  
  //Method to check the order history an any trading pair  
  public orderHistory = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      let query = {};
      const symbol = req.query.symbol || '';
      const interval = req.query.interval || '';
      if (symbol) {
        query['symbol'] = symbol.toUpperCase();
      }
      if (interval) {
        query['interval'] = interval
      }
      //if any order is present, the response is sent back.
      const data = await OrderHistorychema.find(query).sort({ createdAt: -1 });
      return DataResponse(req, res, 200, 'Success', data.length, data);
    } catch (error) {
      next(error);
    }
  };  

  //Method to post trade to binance, it accepts the tradingpair and leverage
  public setText = async (req: Request | any, res: Response, next: NextFunction) => {
    let checkErrorExist = CheckErrors(req);
    if (checkErrorExist) return ErrorValidations(res, req, 422);
    //Rule1: Condition1: Check for the predicted probablity of trade success, if greater tha 0.9 OR 90%, take the trade else leave it
    //Rule1: Condition2: Additionally, take tha trades only if the signal trade is not closed.
    let probablity = req.query.probablity || '';
    let closeTime = req.query.closeTime || '';
    let entryPrice = req.query.entryPrice || '';    
    if(probablity >= 0.9 && closeTime == null){      
      try {
        //This block checks for the inputs for the trade.
        const ticker = req.query.ticker || '';
        const interval = req.query.interval || '';
        let leverage = req.query.leverage;
  
        //Default leverage is set to 1
        leverage = leverage ? JSON.parse(leverage) : 1;
        let symbol = req.params.symbol || '';
        if (!symbol) throw new createHttpError.NotAcceptable('Symbol Not Found');      
        let body = req.body.data;
        symbol = symbol.toUpperCase();        
        //Check for the current price for the input tradingpair
        let futurePrice = await this.binance.futuresPrices({ symbol: ticker });        
        console.log("check futurePrice", futurePrice.price);                

        let futureLeverage = await this.binance.futuresLeverage(ticker, leverage);
        console.log("leverage", futureLeverage);      
        
        let accountInfo = await this.binance.futuresAccount();
        console.log("balance:", (accountInfo.availableBalance)/3);
        //take latest price from binance and get the quantity which can be purchased for 1/3rd of balance
        let contractQuantity = (((accountInfo.availableBalance)/3)/futurePrice.price).toFixed(0);
        console.log("contract quantity", contractQuantity);        
        console.log("body: ", body);
        //check for the signal from Junaid, if it is short, execute this code
        if (body.includes('short')) {
          
          console.log("1.001 * entryPrice", 1.001 * entryPrice);
          //Rule1: Condition3: Take trade only if signal price is equal OR at max. 0.1% lower than the current price.    
          if(futurePrice.price <= 0.999 * entryPrice){          
            return DataResponse(req, res, 200, 'Success', 0, "no trade");
          }
            let order = await this.binance.futuresMarketSell(ticker, contractQuantity, {
              newOrderRespType: 'RESULT',
              positionSide: 'SHORT'
            });
            console.log("new order added: ", order);
            return DataResponse(req, res, 200, 'Success', 1, order);
          
  
        //check for the signal from Junaid, if it is long, execute this code
        } else if (body.includes('long')) {                  
          
            //Rule1: Condition3: Take trade only if signal price is equal OR at max. 0.1% lower than the current price.    
            if(futurePrice.price <= 1.001 * entryPrice){          
              return DataResponse(req, res, 200, 'Success', 0, "no trade");
            }
            let order = await this.binance.futuresMarketBuy(ticker, contractQuantity, {              
              positionSide: 'LONG',              
            });
            
            console.log("order executed successfully!: ", order);            
            return DataResponse(req, res, 200, 'Success', 1, order);
          
        } else if(body.includes('close')){
          //Rule2: check for the signal from Junaid, if it is close, close the current trade          
          let futurePosition = await this.binance.futuresPositionRisk({ symbol: ticker });
          //if position already exist, close it.
          if (futurePosition[0].positionAmt > 0) {
            let quantity = Math.abs(JSON.parse(futurePosition[0].positionAmt));
            let newOrder = await this.binance.futuresMarketBuy(ticker, quantity, {
              newOrderRespType: 'RESULT',
              positionSide: 'LONG'
            });
            console.log("Order closed: ", newOrder);                      
            return DataResponse(req, res, 200, 'Success', 1, newOrder);
          }
        }
      } catch (error) {
        next(error);
      }
    }    
  };

  public checktradeforCron = async () => {        
    let trades: any = await this.fetchTradersFromDatabase();
    trades.forEach(async row => {
      //Rule1: Condition1: Check for the predicted probablity of trade success, if greater tha 0.9 OR 90%, take the trade else leave it
    //Rule1: Condition2: Additionally, take tha trades only if the signal trade is not closed.
    // console.log(row);
    let probablity = row.PredictionProbability || '';
    let closeTime = row.closedTime || '';
    let entryPrice = row.entryPrice || '';    
    console.log("check 1: ", row.PredictionProbability, closeTime);
    if(probablity >= 0.9 && !closeTime){      
      console.log("check 2: ", row.PredictionProbability);
      try {
        //This block checks for the inputs for the trade.
        const ticker = row.symbol || '';          
        let leverage = 1;
  
        //Default leverage is set to 1
        // leverage = leverage ? JSON.parse(leverage) : 1;
        let symbol = row.symbol || '';
        if (!symbol) throw new createHttpError.NotAcceptable('Symbol Not Found');
        let body = row.side == 'Sell' ? 'short' : 'long';
        symbol = symbol.toUpperCase();        
        //Check for the current price for the input tradingpair
        let futurePrice = await this.binance.futuresPrices({ symbol: ticker });        
        console.log("check futurePrice", futurePrice.price);                

        let futureLeverage = await this.binance.futuresLeverage(ticker, leverage);
        console.log("leverage", futureLeverage);      
        
        let accountInfo = await this.binance.futuresAccount();
        console.log("balance:", (accountInfo.availableBalance)/3);
        //take latest price from binance and get the quantity which can be purchased for 1/3rd of balance
        let contractQuantity = (((accountInfo.availableBalance)/3)/futurePrice.price).toFixed(0);
        console.log("contract quantity", contractQuantity);        
        console.log("body: ", body);
        //check for the signal from Junaid, if it is short, execute this code
        if (body.includes('short')) {
          
          console.log("1.001 * entryPrice", 1.001 * entryPrice);
          //Rule1: Condition3: Take trade only if signal price is equal OR at max. 0.1% lower than the current price.    
          if(futurePrice.price <= 0.999 * entryPrice){   
            await this.updateLiveTrade(2);
            console.log("no trade as signal price is equal OR at max. 0.1% lower than the current price.")
          }else{
            let order = await this.binance.futuresMarketSell(ticker, contractQuantity, {
              newOrderRespType: 'RESULT',
              positionSide: 'SHORT'
            });
            console.log("new order added: ", order);
            await this.updateLiveTrade(1);            
          }                      
          //check for the signal from Junaid, if it is long, execute this code
        } else if (body.includes('long')) {                            
            //Rule1: Condition3: Take trade only if signal price is equal OR at max. 0.1% lower than the current price.    
            if(futurePrice.price <= 1.001 * entryPrice){          
              await this.updateLiveTrade(2);
              console.log("no trade as signal price is equal OR at max. 0.1% lower than the current price.")
            }else{
              let order = await this.binance.futuresMarketBuy(ticker, contractQuantity, {              
                positionSide: 'LONG',              
              });
              
              console.log("order executed successfully!: ", order);            
              await this.updateLiveTrade(1);
            }                      
        } else if(body.includes('close')){
          //Rule2: check for the signal from Junaid, if it is close, close the current trade          
          let futurePosition = await this.binance.futuresPositionRisk({ symbol: ticker });
          //if position already exist, close it.
          if (futurePosition[0].positionAmt > 0) {
            let quantity = Math.abs(JSON.parse(futurePosition[0].positionAmt));
            let newOrder = await this.binance.futuresMarketBuy(ticker, quantity, {
              newOrderRespType: 'RESULT',
              positionSide: 'LONG'
            });
            console.log("Order closed: ", newOrder);            
          }
        }
      } catch (error) {
        console.log(error);
      }
    }else{
      console.log("trade rejected for probablity OR closeTime")
      await this.updateLiveTrade(2);
    }
    });    
    return new Promise(async (resolve, reject) => {
      const pool = mysql.createPool(this.dbConfig);
      pool.getConnection((err, connection) => {
        let sql = 'SELECT * from live_trades lt where PredictionValue = 1 and PredictionProbability >= 0.9 order by transactTimeE3 desc;';
        if (err) {
          console.log('query connec error!', err);        
        } else {
          connection.query(sql, (err, results) => {
            if (err) {            
            } else {
              trades = results;
              // console.log(results);
              
            }
          });
        }
      })        
    });
  }

  public updateLiveTrade = (value) => {    
    return new Promise((resolve, reject) => {
      const pool = mysql.createPool(this.dbConfig);
      pool.getConnection((err, connection) => {
        if (err) {
          console.log('query connec error!', err);
          reject(err);
        } else {
          connection.query(`UPDATE live_trades SET isTradeExecuted = ${value}`, (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
            connection.release();
          });
        }
      });
    });
  }

  public fetchTradersFromDatabase = () => {
    return new Promise((resolve, reject) => {
      const pool = mysql.createPool(this.dbConfig);
      pool.getConnection((err, connection) => {
        if (err) {
          console.log('query connec error!', err);
          reject(err);
        } else {          
          connection.query('SELECT * from live_trades lt where PredictionValue = 1 and PredictionProbability >= 0.9 and isTradeExecuted = 0 order by transactTimeE3 desc;', (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);     
              console.log("results", results);
            }
            connection.release();
          });
        }
      });
    });
  };
  //Method to close all trades on binance
  public closePositions = async (req: Request | any, res: Response, next: NextFunction) => {
    
    // const portfolio = await TradingAmountchema.findOne();
    //Rule3: If the portfolio goes down by 10%
    let response = await this.binance.futuresAccount();
    console.log("totalWalletBalance:", response.totalWalletBalance);
    console.log("totalMarginBalance:", response.totalMarginBalance);
    if(response.totalMarginBalance/response.totalWalletBalance > 0.9){
      return DataResponse(req, res, 200, 'Success', 1, "waiting for closing the positions");
    }
    //Rule4: if we loose signal from the Junaid's end.
    // let date = Date.now()
    // if(portfolio.lastTradeTime > date - 18000){      
    //   return DataResponse(req, res, 200, 'Success', 1, "last signal time is less than 5 minutes");
    // }
    let orders = await this.binance.futuresPositionRisk();    
    let openOrders = orders.filter(order => order.positionAmt != 0);
    openOrders.forEach(async trade => {
      if(trade.positionSide == 'LONG'){
        let quantity = Math.abs(JSON.parse(trade.positionAmt));
        let newOrder = await this.binance.futuresMarketSell(trade.symbol, quantity, {
          newOrderRespType: 'RESULT',
          positionSide: 'LONG',
          type: 'MARKET'
        });
        console.log(newOrder)
      }else if(trade.positionSide == 'SHORT'){
        let quantity = Math.abs(JSON.parse(trade.positionAmt));
        let newOrder = await this.binance.futuresMarketBuy(trade.symbol, quantity, {
          newOrderRespType: 'RESULT',
          positionSide: 'SHORT',
          type: 'MARKET'
        });
        console.log(newOrder)
      } 
      
    });
    return DataResponse(req, res, 200, 'Success', 1, openOrders);
  }
    //Method to get trades from binance based on order status, tradingpair
  public getall = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page == 0 ? 1 : req.query.page || 1;
      const limit = req.query.limit * 1 || 20;
      const search = req.query.search || '';
      const type = req.query.type || '';
      const status = req.query.status || '';
      const symbol = req.query.symbol || '';
      let order: any = [];

      order = await this.binance.futuresAllOrders();
      if (status && symbol) {
        order = order.filter(
          (x: any) => x.status.toLowerCase() == status.toLowerCase() && x.symbol.toLowerCase() == symbol.toLowerCase(),
        );
      } else {
        if (status) {
          order = order.filter((x: any) => x.status.toLowerCase() == status.toLowerCase());
        }
        if (symbol) {
          order = order.filter((x: any) => x.symbol.toLowerCase() == symbol.toLowerCase());
        }
      }

      let query = {};
      if (type) {
        query['type'] = type;
      }
      if (search) {
        query['$or'] = [{ symbol: { $regex: search, $options: 'i' } }];
      }
      const data = await Orderchema.find(query)
        .sort({ createdAt: -1 })
        .skip(limit * (page - 1))
        .limit(limit);
      DataResponse(
        req,
        res,
        200,
        'Success',
        0,
        {
          ordersLength: data.length,
          orders: data,
          binanceOrdersLength: order.length,
          binanceOrders: order,
        },
        {
          type: type,
          page: page,
          limit: limit,
          pageCount: Math.ceil(data.length / limit),
          search: search,
        },
      );
    } catch (error) {
      next(error);
    }
  };

    //Method to get all trades from binance
  public getText = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      var temPath = path.join(__dirname, `../../../uploads`);
      const status = req.query.status || '';
      const orders = await this.binance.futuresAllOrders();
      console.log(orders);
      let order = orders;
      if (status) {
        order = orders.filter((x: any) => x.status.toLowerCase() == status.toLowerCase());
      }
      readFile(temPath + `/${getdate()}_text.json`, 'utf8', async (error: any, data: any) => {
        if (error) {
          DataResponse(req, res, 200, 'Success', 0, {
            ordersCount: order.length,
            allOrders: order,
            storedData: [],
          });
        } else {
          const grabbedData = JSON.parse(data);
          DataResponse(req, res, 200, 'Success', 0, {
            ordersCount: order.length,
            allOrders: order,
            storedData: grabbedData,
          });
        }
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default TradingController;
