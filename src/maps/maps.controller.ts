import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { MapsService } from './maps.service';
import { AddMapDto } from './dto/add-map.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { MapDto } from './dto/map.dto';

@ApiBearerAuth()
@Controller('maps')
export class MapsController {
  constructor(private readonly mapService: MapsService) {}

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: MapDto })
  async addMap(@Body() payload: AddMapDto): Promise<MapDto> {
    return await this.mapService.addMap(payload);
  }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [MapDto] })
  async getMaps(): Promise<MapDto[]> {
    return await this.mapService.getMaps();
  }
}
