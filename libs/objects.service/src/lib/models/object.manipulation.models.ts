import { ApiProperty } from '@nestjs/swagger/dist'
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsPositive
} from 'class-validator'

export class ObjectManipulationModel {
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
  objectTypeId?: number = 0
}
