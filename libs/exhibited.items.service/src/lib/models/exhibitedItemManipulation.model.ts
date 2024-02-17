import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsPositive } from 'class-validator'

export class ExhibitedItemAdditionModel {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  itemId: number = 0
}