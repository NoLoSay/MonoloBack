import { ApiProperty } from '@nestjs/swagger/dist'
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsPositive
} from 'class-validator'

export class AddressManipulationModel {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  houseNumber: string = ''

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  street: string = ''

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  zip: string = ''

  @ApiProperty()
  @IsString()
  @IsOptional()
  otherDetails?: string

  @ApiProperty()
  @IsNumber()
  longitude: number = -1.5753814518204865

  @ApiProperty()
  @IsNumber()
  latitude: number = 47.20937936224022

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  cityId: number = 0
}
