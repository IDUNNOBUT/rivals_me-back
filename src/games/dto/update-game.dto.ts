import { ApiProperty } from '@nestjs/swagger';

export class UpdateGameDto {
  @ApiProperty({ example: '2024-03-20', required: false })
  date?: string;
  @ApiProperty({ required: false })
  duration?: number;
  @ApiProperty({ required: false })
  hero?: string;
  @ApiProperty({ required: false })
  map?: string;
  @ApiProperty({ required: false })
  ranked?: boolean;
  @ApiProperty({ required: false })
  win?: boolean;
  @ApiProperty({ required: false })
  kills?: number;
  @ApiProperty({ required: false })
  deaths?: number;
  @ApiProperty({ required: false })
  assists?: number;
}
