import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';

export class SendAuthToVscodeRequestDto {
  @IsString()
  @IsNotEmpty()
  @Length(32, 128)
  nonce: string;

  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class SendAuthToVscodeResponseDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(['ok', 'error'])
  status: 'ok' | 'error';

  @IsString()
  message?: string;
}
