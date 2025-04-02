import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { AddGameDto } from './dto/add-game.dto';
import { GameDto } from './dto/game.dto';
import {
  ApiBearerAuth,
  ApiQuery,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { TopHeroDto } from './dto/top-hero.dto';
import { UserStatDto } from './dto/user-stat.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameFilterDto } from './dto/game-filter.dto';
import { PaginationDto, WithPaginationDto } from '../common/dto/pagination.dto';
import { ApiQueries } from '../common/decorators/api-queries.decorator';
import { UserOverallStatDto } from './dto/user-overall-stat.dto';

@ApiBearerAuth()
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: GameDto })
  async addGame(@Req() req, @Body() payload: AddGameDto): Promise<GameDto> {
    try {
      return this.gamesService.addGame(req.user.id, payload);
    } catch (e) {
      return e;
    }
  }

  @Delete(':id')
  @ApiResponse({ status: HttpStatus.OK, type: GameDto })
  async deleteGame(@Req() req, @Param('id') id: string): Promise<GameDto> {
    try {
      return this.gamesService.deleteGame(req.user.id, id);
    } catch (e) {
      return e;
    }
  }

  @Patch(':id')
  @ApiResponse({ status: HttpStatus.OK, type: GameDto })
  async updateGame(
    @Req() req,
    @Body() payload: UpdateGameDto,
    @Param('id') id: string,
  ): Promise<GameDto> {
    try {
      return this.gamesService.updateGame(req.user.id, id, payload);
    } catch (e) {
      return e;
    }
  }

  @Get()
  @ApiQueries(GameFilterDto, PaginationDto)
  @ApiQuery({
    name: 'id',
    type: String,
    description: 'Optional, if not provided, will use id from auth token',
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(GameDto) },
        },
        meta: {
          type: 'object',
          properties: {
            pages: { type: 'number' },
            hasMore: { type: 'boolean' },
          },
        },
      },
    },
  })
  async getGames(
    @Req() req,
    @Query() query: GameFilterDto & PaginationDto,
    @Query('id') paramId?: string,
  ): Promise<WithPaginationDto<GameDto[]>> {
    try {
      const filter = new GameFilterDto(query);
      const pagination = new PaginationDto(query);
      return this.gamesService.getGames(
        paramId || req.user.id,
        filter,
        pagination,
      );
    } catch (e) {
      return e;
    }
  }

  @Get('top')
  @ApiResponse({ status: HttpStatus.OK, type: [TopHeroDto] })
  async getTopHeroes(): Promise<TopHeroDto[]> {
    try {
      return this.gamesService.getTopHeroes();
    } catch (e) {
      return e;
    }
  }

  @Get('stat')
  @ApiQuery({
    name: 'id',
    type: String,
    description: 'Optional, if not provided, will use id from auth token',
    required: false,
  })
  @ApiResponse({ status: HttpStatus.OK, type: UserStatDto })
  async getUserGameStats(
    @Req() req,
    @Query('id') paramId?: string,
  ): Promise<UserStatDto> {
    try {
      return this.gamesService.getUserGameStats(paramId || req.user.id);
    } catch (e) {
      return e;
    }
  }

  @Get('overall')
  @ApiQuery({
    name: 'id',
    type: String,
    description: 'Optional, if not provided, will use id from auth token',
    required: false,
  })
  @ApiResponse({ status: HttpStatus.OK, type: UserOverallStatDto })
  async getUserOverallStats(
    @Req() req,
    @Query('id') paramId?: string,
  ): Promise<UserOverallStatDto> {
    try {
      return this.gamesService.getUserOverallStats(paramId || req.user.id);
    } catch (e) {
      return e;
    }
  }
}
