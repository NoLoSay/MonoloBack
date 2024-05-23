import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsPositive } from 'class-validator'

export class ExhibitedItemAdditionModel {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  itemId: number = 0
}