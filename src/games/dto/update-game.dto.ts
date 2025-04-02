import { ApiProperty } from '@nestjs/swagger';

export class UpdateGameDto {
  @ApiProperty({ required: false })
  date?: Date;
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
