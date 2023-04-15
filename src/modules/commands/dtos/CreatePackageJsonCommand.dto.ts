import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePackageJsonCommandDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
