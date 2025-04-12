import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { Game } from './schemas/game.schema';
import { AddGameDto } from './dto/add-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { AggregatedGame, GameDto } from './dto/game.dto';
import { HeroesService } from '../heroes/heroes.service';
import { MapsService } from '../maps/maps.service';
import { TopHeroDto } from './dto/top-hero.dto';
import { UserStatDto } from './dto/user-stat.dto';
import { GameFilterDto } from './dto/game-filter.dto';
import { PaginationDto, WithPaginationDto } from '../common/dto/pagination.dto';
import { UserOverallStatDto } from './dto/user-overall-stat.dto';

@Injectable()
export class GamesService {
  constructor(
    private heroesService: HeroesService,
    private mapsService: MapsService,
    @InjectModel(Game.name) private readonly gameModel: Model<Game>,
  ) {}

  async addGame(user: string, payload: AddGameDto): Promise<GameDto> {
    const gameData = {
      ...payload,
      user,
      date: new Date(payload.date)
    };

    const [map, hero] = await Promise.all([
      this.mapsService.findMapById(payload.map),
      this.heroesService.findHeroById(payload.hero),
    ]);

    const newGame = await this.gameModel.create(gameData);

    return this.convertGameToDTO(newGame);
  }

  async updateGame(
    user: string,
    game: string,
    updateData: UpdateGameDto,
  ): Promise<GameDto> {
    const data = { 
      ...updateData,
      ...(updateData.date && { date: new Date(updateData.date) })
    };

    const updatedGame = await this.gameModel.findOneAndUpdate(
      {
        _id: game,
        user,
      },
      { $set: data },
      { new: true },
    );

    if (!updatedGame) throw new BadRequestException('Игра не найдена');

    return this.convertGameToDTO(updatedGame);
  }

  async deleteGame(user: string, id: string): Promise<GameDto> {
    const deletedGame = await this.gameModel.findOneAndDelete({
      _id: id,
      user,
    });

    if (!deletedGame) throw new BadRequestException('Игра не найдена');

    return this.convertGameToDTO(deletedGame);
  }

  async getGames(
    user: string,
    filter: GameFilterDto = {},
    pagination: PaginationDto,
  ): Promise<WithPaginationDto<GameDto[]>> {
    const matchStage: Record<string, any> = { user };

    if (filter.date) {
      const startDate = new Date(filter.date);
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(filter.date);
      endDate.setUTCHours(23, 59, 59, 999);

      matchStage.date = { $gte: startDate, $lte: endDate };
    }

    for (const [key, value] of Object.entries(filter)) {
      if (value !== undefined && key !== 'date') {
        matchStage[key] =
          value === 'true' || value === 'false' ? value === 'true' : value;
      }
    }

    const totalCount = await this.gameModel.countDocuments(matchStage);

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'heroes',
          localField: 'hero',
          foreignField: '_id',
          as: 'hero',
        },
      },
      { $unwind: '$hero' },
      {
        $lookup: {
          from: 'maps',
          localField: 'map',
          foreignField: '_id',
          as: 'map',
        },
      },
      { $unwind: '$map' },
    ];

    let pages = 1;
    let hasMore = false;

    if (pagination?.page && pagination?.pageSize) {
      const { page, pageSize } = pagination;
      pages = Math.ceil(totalCount / pageSize);
      hasMore = page < pages;
      pipeline.push({ $skip: (page - 1) * +pageSize }, { $limit: +pageSize });
    }

    const games = await this.gameModel.aggregate(pipeline);

    return {
      data: games.map((game) => new GameDto(game)),
      meta: { pages, hasMore },
    };
  }

  async getTopHeroes(): Promise<TopHeroDto[]> {
    const totalGames = await this.gameModel.countDocuments();

    return this.gameModel.aggregate([
      {
        $group: {
          _id: '$hero',
          gamesPlayed: { $sum: 1 },
          wins: { $sum: { $cond: ['$win', 1, 0] } },
        },
      },
      {
        $lookup: {
          from: 'heroes',
          localField: '_id',
          foreignField: '_id',
          as: 'heroData',
        },
      },
      { $unwind: '$heroData' },
      {
        $project: {
          _id: 0,
          id: '$heroData._id',
          name: '$heroData.name',
          role: '$heroData.role',
          pickRate: {
            $multiply: [
              { $round: [{ $divide: ['$gamesPlayed', totalGames] }, 2] },
              100,
            ],
          },
          winRate: {
            $multiply: [
              { $round: [{ $divide: ['$wins', '$gamesPlayed'] }, 2] },
              100,
            ],
          },
        },
      },
      { $sort: { pickRate: -1 } },
      { $limit: 3 },
    ]);
  }

  async getUserGameStats(user: string): Promise<UserStatDto> {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const stats = await this.gameModel.aggregate([
      {
        $match: {
          user,
          date: { $gte: lastMonth },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%d-%m-%Y', date: '$date' } },
          wins: { $sum: { $cond: ['$win', 1, 0] } },
          losses: { $sum: { $cond: ['$win', 0, 1] } },
        },
      },
      {
        $project: {
          date: '$_id',
          winRatio: { $subtract: ['$wins', '$losses'] },
        },
      },
      { $sort: { date: 1 } },
    ]);

    return {
      labels: stats.map((entry) => entry.date as string),
      data: stats.map((entry) => entry.winRatio as number),
    };
  }

  async getUserOverallStats(user: string): Promise<UserOverallStatDto> {
    const stats = await this.gameModel.aggregate([
      {
        $match: { user },
      },
      {
        $group: {
          _id: null,
          totalGames: { $sum: 1 },
          wins: { $sum: { $cond: ['$win', 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          totalGames: 1,
          winRate: {
            $multiply: [
              { $round: [{ $divide: ['$wins', '$totalGames'] }, 2] },
              100,
            ],
          },
        },
      },
    ]);

    if (!stats.length) {
      return new UserOverallStatDto(0, 0);
    }

    return new UserOverallStatDto(stats[0].totalGames, stats[0].winRate);
  }

  async convertGameToDTO(game: Game): Promise<GameDto> {
    const [aggregatedGame]: AggregatedGame[] = await this.gameModel.aggregate([
      { $match: { _id: game._id } },
      {
        $lookup: {
          from: 'heroes',
          localField: 'hero',
          foreignField: '_id',
          as: 'hero',
        },
      },
      { $unwind: '$hero' },
      {
        $lookup: {
          from: 'maps',
          localField: 'map',
          foreignField: '_id',
          as: 'map',
        },
      },
      { $unwind: '$map' },
    ]);

    return new GameDto(aggregatedGame);
  }
}
