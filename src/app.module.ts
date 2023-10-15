import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import * as process from 'process'

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: process.env.NODE_ENV === 'production' ? {} : {
        autoLogging: true,
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: false,
            colorize: true,
            levelFirst: true,
            translateTime: 'mm/dd/yyyy, hh:MM:ss TT Z'
          },
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
