// import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import * as repl from 'repl'
import * as Logger from 'purdy'
// import { UsersService } from './users/users.service'
import { ConfigService } from '@nestjs/config'
import targetModule = require('./app.module')
import { AppService } from './app.service'

const LOGGER_OPTIONS = {
  indent: 2,
  depth: 1,
}

class InteractiveNestJS {
  async run() {
    const app = await NestFactory.createApplicationContext(
      // tslint:disable-next-line: no-string-literal
      targetModule['AppModule'],
    )
    const server = repl.start({
      useColors: true,
      prompt: '> ',
      writer: replWriter,
      ignoreUndefined: true,
    })
    server.context.app = app
    server.context.test = app.get(AppService)
    // server.context.config = app.get(ConfigService)
  }
}

function replWriter(value: object): string {
  return Logger.stringify(value, LOGGER_OPTIONS)
}

const session = new InteractiveNestJS()
session.run()
