import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsPositive } from 'class-validator'

export class ExhibitedObjectAdditionModel {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  objectId: number = 0
}