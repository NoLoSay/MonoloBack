import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MinLength,
  IsEmail,
  IsStrongPassword,
  IsNotEmpty,
} from 'class-validator';

export class UserCreateModel {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  username: string = '';

  @ApiProperty()
  @IsEmail()
  email: string = '';

  @ApiProperty()
  @IsStrongPassword({
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string = '';

  @ApiProperty()
  @IsOptional()
  @IsString()
  telNumber?: string;
}

export class UserUpdateModel {
  @ApiProperty()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsOptional()
  picture?: string;

  @ApiProperty()
  @IsStrongPassword({
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  telNumber?: string;
}

export class UserChangePasswordModel {
  @ApiProperty()
  @IsString()
  @IsOptional()
  token: string = '';

  @ApiProperty()
  @IsString()
  @IsOptional()
  oldPassword: string = '';

  @ApiProperty()
  @IsString()
  @IsOptional()
  userMail: string = '';

  @ApiProperty()
  @IsStrongPassword({
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string = '';
}
