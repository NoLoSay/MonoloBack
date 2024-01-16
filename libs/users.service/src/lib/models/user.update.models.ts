import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UserUpdateModel {
  @ApiProperty()
  @IsString()
  @IsOptional()
  username?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  email?: string

  @ApiProperty()
  @IsOptional()
  picture?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string
}

export class UserAdminUpdateModel extends UserUpdateModel {
  @ApiProperty()
  @IsString()
  @IsOptional()
  role?: string
}
