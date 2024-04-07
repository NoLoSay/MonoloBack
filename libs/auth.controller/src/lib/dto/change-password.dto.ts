import { ApiProperty } from '@nestjs/swagger';
import {
  IsStrongPassword,
} from 'class-validator';

export class changePasswordDto {
  token: string = '';
  @ApiProperty()
  @IsStrongPassword({
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string = '';
}
