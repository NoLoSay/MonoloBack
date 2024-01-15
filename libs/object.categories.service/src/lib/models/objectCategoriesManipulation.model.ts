import { ApiProperty } from '@nestjs/swagger/dist'
import {
  IsString,
  IsNotEmpty,
} from 'class-validator'

export class ObjectCategoryManipulationModel {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string = ''

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string = ''
}
