import { Module } from '@nestjs/common';
import { VscodeGateway } from './vscode.gateway';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register()],
  controllers: [],
  providers: [VscodeGateway],
})
export class VscodeModule { }
