import { ApiProperty } from '@nestjs/swagger/dist'
import {
  IsString,
  IsNotEmpty,
} from 'class-validator'

export class ItemCategoryManipulationModel {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string = ''

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string = ''
}
