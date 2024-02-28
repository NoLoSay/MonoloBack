import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsPositive } from 'class-validator'

export class LocationReferentAdditionModel {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  referentId: number = 0

  @ApiProperty()
  @IsOptional()
  isMain?: boolean = false
}

export class LocationReferentModificationModel {
  @ApiProperty()
  isMain: boolean = false
}
