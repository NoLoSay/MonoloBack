import { ApiProperty } from '@nestjs/swagger/dist'
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsPositive,
  IsDate
} from 'class-validator'

export class ExhibitionManipulationModel {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string = ''

  @ApiProperty()
  @IsOptional()
  @IsString()
  shortDescription?: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  longDescription?: string

  @ApiProperty()
  @IsOptional()
  @IsDate()
  startDate?: Date

  @ApiProperty()
  @IsOptional()
  @IsDate()
  endDate?: Date

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  siteId: number = 0
}
