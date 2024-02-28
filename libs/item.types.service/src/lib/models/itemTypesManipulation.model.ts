import { ApiProperty } from '@nestjs/swagger/dist'
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsPositive
} from 'class-validator'

export class ItemTypeManipulationModel {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string = ''

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  description: string = ''

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  itemCategoryId: number = 0
}
