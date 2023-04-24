import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Cache } from 'cache-manager';
import { Server, Socket } from 'socket.io';
import {
  VSCODE_NONCE,
  VSCODE_NONCE_EXPIRATION_SECONDS,
} from './vscode.constants';

@WebSocketGateway(28181, { transports: ['websocket'] })
export class VscodeGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(VscodeGateway.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) { }

  // TODO: test this method
  @SubscribeMessage('vscode:register-for-auth')
  registerForAuth(@MessageBody() nonce: string): void {
    this.logger.debug(`[vscode:register-for-auth] ${nonce}`);
    this.cacheManager.set(
      `${VSCODE_NONCE}_${nonce}`,
      true,
      VSCODE_NONCE_EXPIRATION_SECONDS,
    );
  }
}
