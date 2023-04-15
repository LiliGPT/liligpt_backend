import { Module } from '@nestjs/common';
import { CommandsController } from './commands.controller';
import { PackageJsonCommand } from './packageJson.command';

@Module({
  imports: [],
  providers: [PackageJsonCommand],
  controllers: [CommandsController],
})
export class CommandsModule { }
