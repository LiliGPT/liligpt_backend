import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePackageJsonCommandDto } from './dtos/CreatePackageJsonCommand.dto';
import { PackageJsonCommand } from './packageJson.command';

@Controller('/commands')
export class CommandsController {
  constructor(private readonly packageJsonCommand: PackageJsonCommand) { }

  @Post('/createPackageJsonCommand')
  createPackageJsonCommand(@Body() command: CreatePackageJsonCommandDto): any {
    return this.packageJsonCommand.createPackageJsonCommand(command);
  }
}
