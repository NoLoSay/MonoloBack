import { ApiProperty } from '@nestjs/swagger/dist';
import { IsString, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class ItemTypeManipulationModel {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string = '';

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string = '';

  @ApiProperty()
  @IsInt()
  @IsPositive()
  itemCategoryId: number = 0;
}
