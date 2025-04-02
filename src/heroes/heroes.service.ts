import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hero } from './schemas/hero.schema';
import { AddHeroDto } from './dto/add-hero.dto';
import { HeroDto } from './dto/hero.dto';

@Injectable()
export class HeroesService {
  constructor(@InjectModel(Hero.name) private heroModel: Model<Hero>) {}

  async addHero(hero: AddHeroDto): Promise<HeroDto> {
    const candidate = await this.heroModel.findOne({ name: hero.name });
    if (candidate)
      throw new BadRequestException('Герой с таким именем уже существует');
    return new HeroDto(await this.heroModel.create(hero));
  }

  async findHeroById(id: string): Promise<Hero> {
    const hero = await this.heroModel.findById(id);

    if (!hero) throw new NotFoundException('Герой не найден');

    return hero;
  }

  async getHeroes(): Promise<HeroDto[]> {
    const result = await this.heroModel.find({});
    return result.map((hero) => new HeroDto(hero));
  }
}
