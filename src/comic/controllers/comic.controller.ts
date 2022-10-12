import { Controller, Get, Param, ParseArrayPipe, ParseIntPipe, Post } from '@nestjs/common';
import { ComicService } from '../services/comic.service';

@Controller('comic')
export class ComicController {

    constructor(private readonly comicService: ComicService) {}

    @Get('all/:limit/:offset')
    async findAll(@Param('limit', ParseIntPipe) limit: number, 
    @Param('offset', ParseIntPipe) offset: number) {

        return await this.comicService.findAllComics(limit, offset);
    }

    @Get('id/:id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        return await this.comicService.findComicById(id); 
    }

    @Get('characters/:ids/:limit/:offset')
    async findByCharacters(@Param('ids', ParseArrayPipe) ids: number[], 
    @Param('limit', ParseIntPipe) limit: number, 
    @Param('offset', ParseIntPipe) offset: number) {

        return await this.comicService.findComicsContainingCharacterId(ids, limit, offset);
    }

    @Post('mdb/:id')
    async addMongoDB(@Param('id', ParseIntPipe) id: number) {
        return await this.comicService.addComicMongoDB(id); 
    }

    @Post('sql/:id')
    async addMySQL(@Param('id', ParseIntPipe) id: number) {
        return await this.comicService.addComicMySQL(id); 
    }

}
