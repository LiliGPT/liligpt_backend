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
import { OnEvent } from '@nestjs/event-emitter';
import { SendAuthToVscodeDto, SharedVscodeAuthDto } from './vscode.dto';

@WebSocketGateway(28181, { transports: ['websocket'] })
export class VscodeGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(VscodeGateway.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) { }

  // TODO: test this method
  @SubscribeMessage('vscode:register-for-auth')
  registerForAuth(
    @MessageBody() nonce: string,
    @ConnectedSocket() client: Socket,
  ): void {
    this.logger.debug(`[vscode:register-for-auth] ${nonce}`);
    this.cacheManager.set(
      `${VSCODE_NONCE}_${nonce}`,
      client.id,
      VSCODE_NONCE_EXPIRATION_SECONDS,
    );
  }

  @OnEvent('vscode:auth')
  async handleAuthEvent(payload: SendAuthToVscodeDto): Promise<void> {
    this.logger.debug(`[vscode:auth] ${payload.nonce}`);
    const socketId: string = await this.cacheManager.get(
      `${VSCODE_NONCE}_${payload.nonce}`,
    );
    const client = this.server.sockets.sockets.get(socketId);

    if (client) {
      client.emit(
        'vscode:auth',
        new SharedVscodeAuthDto({
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
        }),
      );
      this.cacheManager.del(`${VSCODE_NONCE}_${payload.nonce}`);
      this.logger.debug(`[vscode:auth] ${payload.nonce} - done`);
      return;
    }

    throw new Error('Invalid vscode:auth event.');
  }
}
