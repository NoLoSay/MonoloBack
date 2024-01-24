import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsNotEmpty, IsPositive, IsEnum } from 'class-validator';
import { AddressManipulationModel } from '@noloback/addresses.service';

enum LocationType {
  MUSEUM,
  LIBRARY,
  ARCHIVE,
  RESTAURANT,
  ATTRACTION,
  PUBLIC_PLACE,
  OTHER
}

enum LocationTag {
  NOLOSAY,
  DISABILITY_FRIENDLY,
  DEAF_FRIENDLY,
  BLIND_FRIENDLY,
  OTHER
}

export class LocationManipulationModel {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string = "";

  @ApiProperty()
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  longDescription?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  telNumber?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  price: number = 0;

  @ApiProperty()
  @IsString()
  @IsOptional()
  picture?: string;

  @ApiProperty({ enum: LocationType })
  @IsEnum(LocationType)
  type: LocationType = LocationType.OTHER;

  @ApiProperty({ enum: LocationTag, isArray: true })
  @IsEnum(LocationTag, { each: true })
  tags: LocationTag[] = [];

  @ApiProperty()
  @IsNotEmpty()
  address: AddressManipulationModel = new AddressManipulationModel();
}