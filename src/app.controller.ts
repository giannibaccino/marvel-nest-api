import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CharacterService } from './character/services/character.service';
import { ComicService } from './comic/services/comic.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    ) {}

  @Post('add/:id')
  addFull(@Param('id', ParseIntPipe) id: number) {
    return console.log(id);
  }
}
