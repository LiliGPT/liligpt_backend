import { Module } from '@nestjs/common';
import { VscodeGateway } from './vscode.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [VscodeGateway],
})
export class VscodeModule { }
