import { ApiProperty } from '@nestjs/swagger/dist'
import {
  IsString,
  IsInt,
  IsOptional,
  IsNotEmpty,
  IsPositive
} from 'class-validator'

export class RoomManipulationModel {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string = ''

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string
}