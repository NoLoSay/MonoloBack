import { ApiProperty } from '@nestjs/swagger/dist'
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsPositive
} from 'class-validator'

export class ItemManipulationModel {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string = ''

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string = ''

  @ApiProperty()
  @IsString()
  @IsOptional()
  picture: string = ''

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  relatedPersonId?: number = 0

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  itemTypeId?: number = 0
}
