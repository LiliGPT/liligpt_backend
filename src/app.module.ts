import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { CommandsModule } from './modules/commands/commands.module';
import { VscodeModule } from './modules/vscode/vscode.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot(),
    VscodeModule,
    CommandsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
