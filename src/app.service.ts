import { Logger, Injectable, OnApplicationShutdown } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

@Injectable()
export class AppService implements OnApplicationShutdown {

  private readonly logger = new Logger(AppService.name);

  constructor(private server: HttpAdapterHost) {
  }
  getHello(): string {
    this.logger.log({prop1: 'val1'}, 'this is a log')
    return 'Hello World!';
  }

  onApplicationShutdown(signal: string) {
    const fastify = this.server.httpAdapter.getInstance()
    this.logger.log({signal, fastify}, 'Shutting down')
  }
}
