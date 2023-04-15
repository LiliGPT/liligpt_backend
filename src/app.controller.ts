import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHome(): any {
    return {
      name: 'NestGPT backend',
      status: 'ok',
    };
  }
}
