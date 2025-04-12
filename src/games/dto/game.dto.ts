import { MapDto } from '../../maps/dto/map.dto';
import { HeroDto } from '../../heroes/dto/hero.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Game } from '../schemas/game.schema';
import { Hero } from '../../heroes/schemas/hero.schema';
import { Map } from '../../maps/schemas/map.schema';

export type AggregatedGame = Omit<Game, 'hero' | 'map'> & {
  hero: Hero;
  map: Map;
};

export class GameDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  user: string;
  @ApiProperty({ example: '2024-03-20' })
  date: string;
  @ApiProperty()
  duration: number;
  @ApiProperty()
  hero: HeroDto;
  @ApiProperty()
  map: MapDto;
  @ApiProperty()
  ranked: boolean;
  @ApiProperty()
  win: boolean;
  @ApiProperty()
  kills: number;
  @ApiProperty()
  deaths: number;
  @ApiProperty()
  assists: number;
  constructor(game: AggregatedGame) {
    this.id = game._id;
    this.user = game.user;
    this.date = game.date.toISOString().split('T')[0];
    this.duration = game.duration;
    this.hero = new HeroDto(game.hero);
    this.map = new MapDto(game.map);
    this.ranked = game.ranked;
    this.win = game.win;
    this.kills = game.kills;
    this.deaths = game.deaths;
    this.assists = game.assists;
  }
}
