import { ApiProperty } from '@nestjs/swagger'
import {
  IsOptional,
  IsEmail,
  IsNumber
} from 'class-validator'

export class ChangeProfileRequestBody {
  @ApiProperty()
  @IsNumber()
  profileId: number = 0
}

export class CreateAdminProfileRequestBody {
  @ApiProperty()
  @IsNumber()
  userId: number = 0
}

export class DeleteAdminProfileRequestBody {
  @ApiProperty()
  @IsNumber()
  userId: number = 0
}

export class CreateModeratorProfileRequestBody {
  @ApiProperty()
  @IsNumber()
  userId: number = 0
}

export class DeleteModeratorProfileRequestBody {
  @ApiProperty()
  @IsNumber()
  userId: number = 0
}

export class CreateManagerProfileRequestBody {
  @ApiProperty()
  @IsNumber()
  userId: number = 0
}
export class DeleteManagerProfileRequestBody {
  @ApiProperty()
  @IsNumber()
  userId: number = 0
}
