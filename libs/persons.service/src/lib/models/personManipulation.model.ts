import { ApiProperty } from '@nestjs/swagger/dist'
import { IsString, IsOptional, IsNotEmpty, IsDate, IsEnum } from 'class-validator'

enum PersonType {
  ARTIST,
  WRITER,
  SCIENTIST,
  CELEBRITY,
  OTHER
}

export class PersonManipulationModel {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string = ''

  @ApiProperty()
  @IsString()
  @IsOptional()
  bio?: string

  @ApiProperty()
  @IsDate()
  @IsOptional()
  birthDate?: Date

  @ApiProperty()
  @IsDate()
  @IsOptional()
  deathDate?: Date

  @ApiProperty({ enum: PersonType })
  @IsEnum(PersonType)
  type: PersonType = PersonType.OTHER;
}
