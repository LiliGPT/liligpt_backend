import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';

interface ISharedVscodeAuth {
  accessToken: string;
  refreshToken: string;
}

export class SharedVscodeAuthDto implements ISharedVscodeAuth {
  constructor(data: ISharedVscodeAuth) {
    Object.assign(this, data);
  }

  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class SendAuthToVscodeDto extends SharedVscodeAuthDto {
  constructor(data: SendAuthToVscodeDto) {
    super(data);
    Object.assign(this, data);
  }

  @IsString()
  @IsNotEmpty()
  @Length(32, 128)
  nonce: string;
}

export class SendAuthToVscodeResponseDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(['ok', 'error'])
  status: 'ok' | 'error';

  @IsString()
  message?: string;
}
