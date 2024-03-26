import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsPositive } from 'class-validator'

export class SiteManagerAdditionModel {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  managerId: number = 0

  @ApiProperty()
  @IsOptional()
  isMain?: boolean = false
}

export class SiteManagerModificationModel {
  @ApiProperty()
  isMain: boolean = false
}
