import { Map } from '../schemas/map.schema';
import { ApiProperty } from '@nestjs/swagger';

export class MapDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  type: string;

  constructor(map: Map) {
    this.id = map._id;
    this.name = map.name;
    this.type = map.type;
  }
}
