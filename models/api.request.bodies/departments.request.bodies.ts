import { ApiProperty } from '@nestjs/swagger/dist';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsPositive,
  IsInt,
} from 'class-validator';

export class DepartmentManipulationModel {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string = '';

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code: string = '';

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  countryId: number = 0;
}
