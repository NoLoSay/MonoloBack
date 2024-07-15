import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsNotEmpty, IsPositive, IsEnum } from 'class-validator';
import { AddressManipulationModel } from './addresses.request.bodies';
import { SiteTag, SiteType } from "@prisma/client/base"

export class SiteManipulationRequestBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string = "";

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  managerId: number = 0;

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

  // @ApiProperty()
  // @IsString()
  // @IsOptional()
  // picture?: string;

  @ApiProperty({ enum: SiteType })
  @IsEnum(SiteType)
  type: SiteType = SiteType.OTHER;

  @ApiProperty({ enum: SiteTag, isArray: true })
  @IsEnum(SiteTag, { each: true })
  tags: SiteTag[] = [];

  @ApiProperty()
  @IsNotEmpty()
  address?: AddressManipulationModel = new AddressManipulationModel();

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  addressId?: number;
}