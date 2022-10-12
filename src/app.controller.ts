import { Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AppService } from './app.service';

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
