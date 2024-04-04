import { ApiProperty } from '@nestjs/swagger'
import {
  IsOptional,
  IsString,
  MinLength,
  IsEmail,
  IsStrongPassword
} from 'class-validator'

export class UserCreateModel {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  username: string = ''

  @ApiProperty()
  @IsEmail()
  email: string = ''

  @ApiProperty()
  @IsStrongPassword({
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })
  password: string = ''

  @ApiProperty()
  @IsString()
  @IsOptional()
  telNumber: string = ''
}

export class UserUpdateModel {
  @ApiProperty()
  @IsString()
  @IsOptional()
  username?: string

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiProperty()
  @IsOptional()
  picture?: string

  @ApiProperty()
  @IsStrongPassword({
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })
  @IsOptional()
  password?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  telNumber?: string
}