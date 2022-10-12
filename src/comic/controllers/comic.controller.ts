import { Controller, Get, HttpStatus, Param, ParseArrayPipe, ParseIntPipe, Post, Res } from '@nestjs/common';
import { ComicService } from '../services/comic.service';
import { ComicMongoDBService } from '../services/comicMongoDB.service';
import { ComicMySqlService } from '../services/comicMySql.service';

@Controller('comic')
export class ComicController {

    constructor(
        private readonly comicService: ComicService,
        private readonly comicMongoDBService: ComicMongoDBService,
        private readonly comicMySqlService: ComicMySqlService,
        ) {}

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
    async addMongoDB(@Res() res, @Param('id', ParseIntPipe) id: number) {
        const exist = await this.comicMongoDBService.findByMarvelId(id);

        if(!exist) {
            await this.comicMongoDBService.addComic(id);
            return res.status(HttpStatus.OK).json({
                message: 'Comic added succesfully to MongoDB'
            }); 
        }

        return res.status(HttpStatus.BAD_REQUEST).json({
            message: 'Comic already exists in MongoDB'
        });
    }

    @Post('sql/:id')
    async addMySQL(@Res() res, @Param('id', ParseIntPipe) id: number) {
        const exist = await this.comicMySqlService.findByMarvelId(id);

        if(!exist) {
            await this.comicMySqlService.addComic(id);
            return res.status(HttpStatus.OK).json({
                message: 'Comic added succesfully to MySql'
            }); 
        }

        return res.status(HttpStatus.BAD_REQUEST).json({
            message: 'Comic already exists in MySql'
        }); 
    }

    @Post('add/:id')
    async addComic(@Res() res, @Param('id', ParseIntPipe) id: number) {
        const exist = await this.comicMongoDBService.findByMarvelId(id);
        const exist2 = await this.comicMySqlService.findByMarvelId(id);

        if(!exist && !exist2) {
            await this.comicMongoDBService.addComic(id);
            await this.comicMySqlService.addComic(id);
            return res.status(HttpStatus.OK).json({
                message: 'Comic added succesfully to both DB'
            });
        }

        else if(exist && exist2) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Comic already exists on both DB'
            });
        }

        else if(exist && !exist2) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Comic already exists on MongoDB, succsefully added to MySQL'
            });
        }

        else {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Comic already exists on MySQL, succsefully added to MongoDB'
            });
        }
    }

}
