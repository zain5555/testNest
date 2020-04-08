import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as passport from 'passport';
import * as session from 'express-session';
import * as flash from 'connect-flash';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { nodeEnv, sessionName } from './common/constants';
/* eslint-disable */
// tslint:disable-next-line:no-var-requires
const MongoDBStore = require('connect-mongodb-session')(session);
/* eslint-enable */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('Touchdown Core API')
    .setDescription('Touchdown Core API')
    .setVersion('1.0')
    .addTag('Auth', 'Auth API Endpoints!')
    .addTag('User', 'User API Endpoints!')
    // .addTag('Invitation', 'Invitation API Endpoints!')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  if (config.nodeEnv !== nodeEnv.PRODUCTION) {
    SwaggerModule.setup('api/docs', app, document);
  }
  app.use(compression());
  app.use(helmet());
  if (config.nodeEnv !== nodeEnv.PRODUCTION) {
    app.enableCors({
      origin: [
      'http://localhost:8080',
      'http://localhost:8081',
      'https://trytouchdown-dev.herokuapp.com',
      'https://trytouchdown.herokuapp.com'
    ],
      credentials: true,
    });
  }

  app.use(morgan('dev'));

  if (config.nodeEnv === nodeEnv.PRODUCTION) {
    app.enable('trust proxy');
  }

  const store = new MongoDBStore({
    uri: config.mongoUri, // This will come from the env file
    collection: 'sessions',
  });
  // use sessions
  const sessionOptions = {
    name: sessionName,
    secret: config.jwtSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      originalMaxAge: 1000 * 60 * 60 * 24 * 30, // 30 days session
      secure: 'auto',
    },
    store,
    trustProxy: false,
  };
  if (config.nodeEnv !== nodeEnv.DEVELOPMENT) {
    sessionOptions.trustProxy = true;
    app.enable('trust proxy');
  }
  app.use(session(sessionOptions));
  
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  await app.listen(config.serverPort);
  console.log('The app is up on port:', config.serverPort);
}
bootstrap();
