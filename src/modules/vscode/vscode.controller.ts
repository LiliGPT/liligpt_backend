import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
} from '@nestjs/common';
import {
  SendAuthToVscodeRequestDto,
  SendAuthToVscodeResponseDto,
} from './vscode.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Controller('/vscode')
export class VscodeController {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) { }

  @Post('/send-auth-to-vscode')
  async sendAuthToVscode(
    @Body() payload: SendAuthToVscodeRequestDto,
  ): Promise<SendAuthToVscodeResponseDto> {
    throw new BadRequestException({
      status: 'error',
    });
  }
}
