import { ApiProperty } from '@nestjs/swagger/dist'
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsPositive
} from 'class-validator'

export class CityManipulationModel {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string = ''

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  zip: string = ''

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
  departmentId: number = 0
}
