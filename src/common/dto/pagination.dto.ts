import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty()
  page: number;
  @ApiProperty()
  pageSize: number;
  constructor(data: PaginationDto) {
    this.page = data.page;
    this.pageSize = data.pageSize;
  }
}

export class WithPaginationDto<T> {
  data: T;
  meta: {
    pages: number;
    hasMore: boolean;
  };
}
