import { ApiProperty } from '@nestjs/swagger/dist';
import { IsNotEmpty, IsString } from 'class-validator';

export class UsernamePasswordCombo {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string = '';

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string = '';
}
