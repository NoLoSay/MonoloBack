import { ApiProperty } from '@nestjs/swagger/dist'
import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator'

export class CountryManipulationModel {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string = ''

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code: string = ''

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  longitude?: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  latitude?: number
}
