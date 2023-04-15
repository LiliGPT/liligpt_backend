import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { CommandsModule } from './modules/commands/commands.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommandsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
