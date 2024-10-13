import { ApiProperty } from '@nestjs/swagger/dist'
import {
  IsString,
  IsInt,
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
  description?: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  textToTranslate: string = ''

  @ApiProperty()
  @IsString()
  @IsOptional()
  picture?: string

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @IsPositive()
  relatedPersonId?: number

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @IsPositive()
  itemTypeId?: number

  @ApiProperty()
  @IsInt()
  @IsPositive()
  siteId: number = 0
}

export class ItemGiveModel {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  siteId: number = 0
}