import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ForbiddenException, Logger, ValidationPipe } from '@nestjs/common';
import * as basicAuth from 'express-basic-auth';
import { NextFunction, Request, Response } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger();
  const port = process.env.API_PORT;
  const app = await NestFactory.create(AppModule, { cors: true });
  const allowList = async () => {
    const list = [];
    const arr = process.env.CORS_ALLOW_LIST.replace(/\s/g, '').split(',');
    for (let i = 0; i < arr.length; i++) {
      list.push(arr[i]);
    }
    return list;
  };

  app.setGlobalPrefix(`api/${process.env.API_VERSION}`);

  app.use(
    [`/api/${process.env.API_VERSION}/docs`],
    basicAuth({
      challenge: true,
      users: {
        [process.env.DOCS_USER]: process.env.DOCS_PASS,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Condo Management API Doc')
    .setDescription("It's an API documentation")
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(`/api/${process.env.API_VERSION}/docs`, app, document);

  app.use(function (req: Request, _res: Response, next: NextFunction) {
    req.headers.origin = req.headers.origin || `http://${req.headers.host}`;
    next();
  });

  if (process.env.ENV === 'production') {
    app.enableCors({
      origin: async function (origin, callback) {
        if ((await allowList()).indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new ForbiddenException('Not allowed by CORS'));
        }
      },
    });
  }

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  await app.listen(port, async () => logger.log(`----Application listening on port ${port}-----`));
}
bootstrap();
