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
  @IsOptional()
  longitude?: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  latitude?: number

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  cityId: number = 0
}
