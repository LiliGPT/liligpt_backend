// https://github.com/nestjs/nest/blob/master/integration/websockets/e2e/gateway.spec.ts
import { INestApplication, ModuleMetadata } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { VscodeGateway } from 'src/modules/vscode/vscode.gateway';
import { io } from 'socket.io-client';
import * as supertest from 'supertest';
import { VscodeController } from 'src/modules/vscode/vscode.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SendAuthToVscodeDto } from 'src/modules/vscode/vscode.dto';

async function createNestApp({
  imports,
  ...props
}: ModuleMetadata): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule({
    imports: [
      CacheModule.register(),
      EventEmitterModule.forRoot(),
      ...(imports ?? []),
    ],
    ...props,
  }).compile();
  const app = testingModule.createNestApplication();
  return app;
}

const TEST_PORT = 28182;
const WS_PORT = 28181;

describe('VscodeGateway (e2e)', () => {
  let ws, app;

  afterEach(async () => {
    await app.close();
    await ws.close();
  });

  it('should not connect with xhr pool', async () => {
    app = await createNestApp({
      providers: [VscodeGateway],
    });
    await app.listen(TEST_PORT);

    ws = io(`http://localhost:${WS_PORT}`, {
      transports: ['polling'],
    });

    await new Promise<void>((resolve, reject) => {
      ws.on('connect', () => {
        reject(new Error('Should not connect'));
      });

      ws.on('connect_error', (err) => {
        expect(err.message).toBe('xhr poll error');
        resolve();
      });

      ws.on('error', (err) => {
        reject(err);
      });
    });
  });

  it('should connect with websockets transport', async () => {
    app = await createNestApp({
      providers: [VscodeGateway],
    });
    await app.listen(TEST_PORT);

    ws = io(`http://localhost:${WS_PORT}`, {
      transports: ['websocket'],
    });

    await new Promise<void>((resolve, reject) => {
      ws.on('connect', () => {
        resolve();
      });

      ws.on('connect_error', (err) => {
        reject(err);
      });

      ws.on('error', (err) => {
        reject(err);
      });
    });
  });

  it('should get error when trying to send invalid auth to vscode', async () => {
    app = await createNestApp({
      providers: [VscodeGateway],
      controllers: [VscodeController],
    });
    await app.listen(TEST_PORT);

    ws = io(`http://localhost:${WS_PORT}`, {
      transports: ['websocket'],
    });

    await supertest(app.getHttpServer())
      .post('/vscode/send-auth-to-vscode')
      .send({
        nonce: 'nonce',
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      })
      .expect(400);

    await supertest(app.getHttpServer())
      .post('/vscode/send-auth-to-vscode')
      .send({
        invalid: 'payload',
      })
      .expect(400);
  });

  it('should send auth to vscode', async () => {
    app = await createNestApp({
      providers: [VscodeGateway],
      controllers: [VscodeController],
    });
    await app.listen(TEST_PORT);

    ws = io(`http://localhost:${WS_PORT}`, {
      transports: ['websocket'],
    });

    await new Promise<void>((resolve, reject) => {
      // ---
      // Handle errors
      ws.on('connect_error', (err) => {
        reject(err);
      });

      ws.on('error', (err) => {
        reject(err);
      });

      // ---
      // Handle successful connection
      ws.on('connect', async () => {
        // variables
        const expectedAuth: SendAuthToVscodeDto = {
          nonce: 'test-Nonce',
          accessToken: 'test-AccessToken',
          refreshToken: 'test-RefreshToken',
        };
        // register for auth
        ws.emit('vscode:register-for-auth', expectedAuth.nonce);
        // wait for auth
        ws.on('vscode:auth', (auth) => {
          expect(auth).toEqual(expectedAuth);
          resolve();
        });
        // send invalid auth
        await supertest(app.getHttpServer())
          .post('/vscode/send-auth-to-vscode')
          .send({
            nonce: 'invalidnonce',
          })
          .expect(400)
          .catch((err) => {
            reject(err);
          });

        // send valid auth
        await supertest(app.getHttpServer())
          .post('/vscode/send-auth-to-vscode')
          .send(expectedAuth)
          .expect(200)
          .catch((err) => {
            reject(err);
          });
      });
    });
  }, 30000);
});
