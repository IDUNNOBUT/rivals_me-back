import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Map } from './schemas/map.schema';
import { AddMapDto } from './dto/add-map.dto';
import { MapDto } from './dto/map.dto';

@Injectable()
export class MapsService {
  constructor(@InjectModel(Map.name) private mapModel: Model<Map>) {}

  async addMap(map: AddMapDto): Promise<MapDto> {
    const candidate = await this.mapModel.findOne({ name: map.name });
    if (candidate)
      throw new BadRequestException('Карта с таким названием уже существует');
    return new MapDto(await this.mapModel.create(map));
  }

  async findMapById(id: string): Promise<Map> {
    const map = await this.mapModel.findById(id);

    if (!map) throw new NotFoundException('Карта не найдена');

    return map;
  }

  async getMaps(): Promise<MapDto[]> {
    const result = await this.mapModel.find({});
    return result.map((map) => new MapDto(map));
  }
}
