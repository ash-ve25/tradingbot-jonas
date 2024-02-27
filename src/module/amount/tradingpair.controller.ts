import TradingAmountchema from '@/models/tradingamount.model';
import { DataResponse } from '@/utils/common';
import { ApiMessage } from '@/utils/messages';
import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

class TradingPairController {
  public getall = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page == 0 ? 1 : req.query.page || 1;
      const limit = req.query.limit * 1 || 50;
      const search = req.query.search || '';
      const isActive = req.query.isActive || '';
      let query = {};
      if (search) {
        query['$or'] = [{ symbol: { $regex: search, $options: 'i' } }];
      }
      if (isActive) {
        query['isActive'] = JSON.parse(isActive);
      }
      const queryTotal = await TradingAmountchema.countDocuments(query)
      const data = await TradingAmountchema.find(query)
        .skip(limit * (page - 1))
        .limit(limit);
      DataResponse(req, res, 200, 'Success', data.length, data, {
        page: page,
        limit: limit,
        pageCount: Math.ceil(queryTotal / limit),
        search: search,
        isActive:isActive
      });
    } catch (error) {
      next(error);
    }
  };
  public create = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const createdAmount = await TradingAmountchema.create(body);
      return DataResponse(req, res, 200, 'Success', 1, createdAmount);
    } catch (error) {
      next(error);
    }
  };
  public async update(req: Request | any, res: Response, next: NextFunction) {
    try {
      const isAmountExist = await TradingAmountchema.findOne({ _id: req.params.id });
      if (!isAmountExist) throw new createHttpError.NotAcceptable(`Amount ${ApiMessage.notexist}`);
      const data = await TradingAmountchema.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { returnOriginal: false },
      );
      return DataResponse(req, res, 200, 'Success', 1, data);
    } catch (error) {
      next(error);
    }
  }
  public async delete(req: Request | any, res: Response, next: NextFunction) {
    try {
      const isAmountExist = await TradingAmountchema.findOne({ _id: req.params.id });
      if (!isAmountExist) throw new createHttpError.NotAcceptable(`Amount ${ApiMessage.notexist}`);
      const data = await TradingAmountchema.findOneAndDelete({ _id: req.params.id }, { returnDocument: 'before' });
      return DataResponse(req, res, 200, 'Success', 1, data);
    } catch (error) {
      next(error);
    }
  }
}

export default TradingPairController;
