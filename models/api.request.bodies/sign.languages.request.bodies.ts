import { ApiProperty } from '@nestjs/swagger'
import {
  IsHexColor,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  MinLength
} from 'class-validator'

export class SignLanguageCreateRequestBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(254)
  name: string = ''

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  code: string = ''

  @ApiProperty()
  @IsString()
  @IsHexColor()
  color: string = ''
}

export class SignLanguageModificationRequestBody {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(254)
  name?: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  code?: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsHexColor()
  color?: string
}
