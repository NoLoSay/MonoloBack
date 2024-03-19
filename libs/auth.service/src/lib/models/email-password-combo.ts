import { ApiProperty } from '@nestjs/swagger/dist';
import { IsNotEmpty, IsString } from 'class-validator';

export class EmailPasswordCombo {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string = '';

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string = '';
}
