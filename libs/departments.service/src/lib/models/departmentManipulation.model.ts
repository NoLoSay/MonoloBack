import { ApiProperty } from '@nestjs/swagger/dist'
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsPositive
} from 'class-validator'

export class DepartmentManipulationModel {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string = ''

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
  countryId: number = 0
}
