import { ApiProperty } from '@nestjs/swagger/dist'
import {
  IsString,
  IsNotEmpty,
  IsHexColor
} from 'class-validator'

export class EnumColorManipulationModel {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsHexColor()
  color: string = ''
}
