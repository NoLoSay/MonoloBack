import { IsString, IsNotEmpty } from 'class-validator';

export class ConfirmEmailModel {
  @IsString()
  @IsNotEmpty()
  token: string = '';
}
