import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { HeroesService } from './heroes.service';
import { AddHeroDto } from './dto/add-hero.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { HeroDto } from './dto/hero.dto';

@ApiBearerAuth()
@Controller('heroes')
export class HeroesController {
  constructor(private readonly heroesService: HeroesService) {}

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: HeroDto })
  async addHero(@Body() payload: AddHeroDto) {
    try {
      return await this.heroesService.addHero(payload);
    } catch (e) {
      return e;
    }
  }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [HeroDto] })
  async getHeroes() {
    return await this.heroesService.getHeroes();
  }
}
