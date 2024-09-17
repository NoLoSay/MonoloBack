import { ApiProperty } from '@nestjs/swagger/dist';

export class PaginatedDto<TData> {
  @ApiProperty()
  total: number = 0;

  @ApiProperty()
  limit: number = 0;

  @ApiProperty()
  offset: number = 0;

  results: TData[] = [];
}
