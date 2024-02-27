import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { ErrorResponse, logError } from './utils/common';
import { LOG_FORMAT, NODE_ENV, PORT } from './config';
import { logger } from '@utils/logger';
import morgan from 'morgan';
import helmet from 'helmet';
import hpp from 'hpp';
import { Routes } from './interface/shared/routes.interface';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import 'reflect-metadata';
import mongoose, { connect } from 'mongoose';
import { dbConnection } from '@databases';
import { HttpError } from 'http-errors';
import { CronJob } from 'cron';
import path from 'path';
import TradingController from './module/trading/trading.controller';
const swaggerDocument = require('../swagger.json');
class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public log_format: string;
  // redis = require('./utils/init_redis');
  nodemon = require('./utils/init_nodemon');
  cronJob: CronJob;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 8000;
    this.log_format = LOG_FORMAT || 'dev';
    this.setStaticFolder();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
    // this.connectToDatabase();
    // this.getToken;
    // this.redis;
    this.cron();
    this.nodemon;
  }
  setStaticFolder() {
    this.app.use('/uploads', express.static('uploads'));
    this.app.use(express.static(path.join(__dirname, 'uploads')));
  }

  private connectToDatabase() {
    mongoose.set('strictQuery', false);
    if (this.env !== 'production') {
      // set('debug', true);
    }
    connect(dbConnection.url, dbConnection.options)
      .then(data => console.log('database connected'))
      .catch(err => {
        console.log(err.message);
        console.log('Database Connection Error');
        logger.error('Database Connection Error');
        process.exit(1);
      });
  }
  tradingController = new TradingController();
  public cron() {
    //    run cron in seconds */1 * * * * *
    let coinCronJob = new CronJob('0/10 * * * * *', async () => {
      try {
        await this.tradingController.checktradeforCron();
      } catch (error) {
        coinCronJob.stop();
      }
    });
    if (!coinCronJob.running) {
      coinCronJob.start();
    }
  }
  public listen() {
    this.app.listen(this.port, () => {
      if (this.env == 'production') {
        logger.info(`=================================`);
        logger.info(`======= ENV: ${this.env} =======`);
        logger.info(`🚀 App listening on the port ${this.port}`);
        logger.info(`=================================`);
      }
      console.log(`======= ENV: ${this.env} =======`);
      console.log(`🚀 App listening on the port ${this.port}`);
    });
  }

  public getServer() {
    return this.app;
  }

  // private cron() {
  //   new TokenCron();
  // }

  private initializeMiddlewares() {
    this.app.use(morgan(this.log_format));
    this.app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
    this.app.use(hpp());
    this.app.use(compression());

    this.app.use(express.urlencoded({ extended: true }));
    this.initializeHelmet();
    // this.app.use(timeout(1200000, {}));
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      if (route.path == '/text') {
        this.app.use('/', express.text(), route.router);
      } else {
        this.app.use('/', express.json({ limit: '50mb' }), route.router);
      }
    });
  }
  private initializeHelmet() {
    this.app.use(helmet.contentSecurityPolicy());
    this.app.use(helmet.crossOriginEmbedderPolicy());
    this.app.use(helmet.crossOriginOpenerPolicy());
    this.app.use(helmet.crossOriginResourcePolicy());
    this.app.use(helmet.dnsPrefetchControl());
    this.app.use(helmet.expectCt());
    this.app.use(helmet.frameguard());
    this.app.use(helmet.hidePoweredBy());
    this.app.use(helmet.hsts());
    this.app.use(helmet.ieNoOpen());
    this.app.use(helmet.noSniff());
    this.app.use(helmet.originAgentCluster());
    this.app.use(helmet.permittedCrossDomainPolicies());
    this.app.use(helmet.referrerPolicy());
    this.app.use(helmet.xssFilter());
  }
  private initializeSwagger() {
    // const options = {
    //   swaggerDefinition: {
    //     info: {
    //       title: 'Secvolt-Screener',
    //       version: '1.0.0',
    //       description: 'Example docs',
    //     },
    //   },
    //   apis: ['swagger.yaml'],
    // };

    // const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  private initializeErrorHandling() {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const error = new Error('Not Found');
      if (this.env == 'production') {
        logError(req, 404, error.message.toLowerCase());
      }
      ErrorResponse(res, 404, error.message.toLowerCase());
    });

    this.app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
      if (this.env == 'production') {
        logError(req, error.status || 500, error.message.toLowerCase());
      }
      ErrorResponse(res, error.status || 500, error.message.toLowerCase());
    });
  }
}

export default App;
