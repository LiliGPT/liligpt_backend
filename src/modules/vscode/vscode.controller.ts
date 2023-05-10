import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Inject,
  Logger,
  Post,
} from '@nestjs/common';
import { SendAuthToVscodeDto, SendAuthToVscodeResponseDto } from './vscode.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { VSCODE_NONCE } from './vscode.constants';
import { Cache } from 'cache-manager';

@Controller('/vscode')
export class VscodeController {
  private readonly logger = new Logger(VscodeController.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  @Post('/send-auth-to-vscode')
  @HttpCode(200)
  async sendAuthToVscode(
    @Body() payload: SendAuthToVscodeDto,
  ): Promise<SendAuthToVscodeResponseDto> {
    if (!payload.nonce) {
      throw new BadRequestException('Missing nonce');
    }

    const fullNonce = `${VSCODE_NONCE}_${payload.nonce}`;

    const nonceExists = await this.cacheManager.get(fullNonce);

    if (!nonceExists) {
      this.logger.debug(`Nonce does not exist: "${fullNonce}"`);
      throw new BadRequestException('Invalid nonce');
    }

    this.eventEmitter.emit('vscode:auth', payload);

    return {
      status: 'ok',
    };
  }
}
