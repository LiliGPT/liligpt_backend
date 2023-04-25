import { Module } from '@nestjs/common';
import { VscodeGateway } from './vscode.gateway';
import { CacheModule } from '@nestjs/cache-manager';
import { VscodeController } from './vscode.controller';

@Module({
  imports: [CacheModule.register()],
  controllers: [VscodeController],
  providers: [VscodeGateway],
})
export class VscodeModule { }
