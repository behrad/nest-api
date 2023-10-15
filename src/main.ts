import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { contentParser } from 'fastify-multer';
import compression from '@fastify/compress';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { fastifyHelmet } from '@fastify/helmet';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino'
import { version } from '../package.json';

async function bootstrap() {
  const adapter = new FastifyAdapter({ logger: true, trustProxy: true })
  const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      adapter,
      { bufferLogs: true },
  )

  app.useLogger(app.get(Logger))
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [
          `'self'`,
          `'unsafe-inline'`,
          'cdn.jsdelivr.net',
          'fonts.googleapis.com',
        ],
        fontSrc: [`'self'`, 'fonts.gstatic.com'],
        imgSrc: [`'self'`, 'data:', 'cdn.jsdelivr.net', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`, `cdn.jsdelivr.net`],
      },
    },
  })

  await app.register(compression)

  await app.register(contentParser)

  adapter.getInstance().addHook('onRequest', (request, reply, done) => {
    request['res'] = reply
    done()
  })

  const config = new DocumentBuilder()
      .setTitle('Hub API')
      .setDescription('Satpay API orchestrator')
      .setVersion(version)
      // .addServer(
      //     `/${configService.get('BASE_PATH', '')}`,
      //     process.env.NODE_ENV || 'Local Development',
      // )
      .addBearerAuth(
          { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
          'JWT-Token',
      )
      .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  // app.enableCors({
  //   origin: new RegExp(configService.get('CORS_REGEX')),
  //   credentials: true,
  // })

  app.enableShutdownHooks()

  await app.listen(3000, '0.0.0.0')
}
bootstrap();
