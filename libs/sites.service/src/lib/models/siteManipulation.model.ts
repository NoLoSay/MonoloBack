import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsNotEmpty, IsPositive, IsEnum } from 'class-validator';
import { AddressManipulationModel } from '@noloback/addresses.service';

enum SiteType {
  MUSEUM,
  LIBRARY,
  ARCHIVE,
  RESTAURANT,
  ATTRACTION,
  PUBLIC_PLACE,
  OTHER
}

enum SiteTag {
  NOLOSAY,
  DISABILITY_FRIENDLY,
  DEAF_FRIENDLY,
  BLIND_FRIENDLY,
  OTHER
}

export class SiteManipulationModel {
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

  @ApiProperty({ enum: SiteType })
  @IsEnum(SiteType)
  type: SiteType = SiteType.OTHER;

  @ApiProperty({ enum: SiteTag, isArray: true })
  @IsEnum(SiteTag, { each: true })
  tags: SiteTag[] = [];

  @ApiProperty()
  @IsNotEmpty()
  address: AddressManipulationModel = new AddressManipulationModel();
}