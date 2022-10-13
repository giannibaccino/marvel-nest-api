import { Controller, Get, Param, ParseIntPipe, Post, Res, HttpStatus, ParseArrayPipe } from '@nestjs/common';
import { MarvelService } from '../services/marvel.service';
import { MongoDBService } from '../services/monogoDB.service';
import { MySqlService } from '../services/mySql.service';

@Controller('marvel')
export class MarvelController {

    constructor(
        private readonly marvelService: MarvelService,
        private readonly mongoDBService: MongoDBService,
        private readonly mySqlService: MySqlService
        ) {}

    /*--- Characters ---*/

    @Get('all_character/:limit/:offset')
    async findAllCharacter(@Param('limit', ParseIntPipe) limit: number, 
    @Param('offset', ParseIntPipe) offset: number) {

        return await this.marvelService.findAllCharactersMDB(limit, offset);
    }

    @Get('character/:id')
    async findCharacterById(@Param('id', ParseIntPipe) id: number) {
        return await this.marvelService.findCharacterByIdMDB(id);
    }

    @Get('name/:name')
    async findCharacterByName(@Param('name') name: string) {
        return await this.marvelService.findCharacterByNameMDB(name);
    }

    @Get('character_comics/:id')
    async findCharacterComicsByCharacterId(@Param('id', ParseIntPipe) id: number) {
        return await this.marvelService.findCharacterComicsByCharacterIdMDB(id);
    }

    @Post('character_mdb/:id')
    async addToMongo(@Res() res, @Param('id', ParseIntPipe) id: number) {
        const exist = await this.mongoDBService.findCharacterByMarvelId(id);

        if(!exist) {
            await this.mongoDBService.addCharacter(id);
            return res.status(HttpStatus.OK).json({
                message: 'Character added succesfully to MongoDB'
            });
        }
        return res.status(HttpStatus.BAD_REQUEST).json({
            message: 'Character already exists in MongoDB'
        });
    }

    @Post('character_sql/:id')
    async addToMySQL(@Res() res, @Param('id', ParseIntPipe) id: number) {
        const exist = await this.mySqlService.findCharacterByMarvelId(id);

        if(!exist) {
            await this.mySqlService.addCharacter(id);
            return res.status(HttpStatus.OK).json({
            message: 'Character added succesfully to MySql'
            });
        }

        return res.status(HttpStatus.BAD_REQUEST).json({
            message: 'Character already exists in MySql'
        });
    }

    @Post('character_add/:id')
    async addCharacter(@Res() res, @Param('id', ParseIntPipe) id: number) {
        const exist = await this.mongoDBService.findCharacterByMarvelId(id);
        const exist2 = await this.mySqlService.findCharacterByMarvelId(id);

        if(!exist && !exist2) {
            await this.mongoDBService.addCharacter(id);
            await this.mySqlService.addCharacter(id);
            return res.status(HttpStatus.OK).json({
                message: 'Character added succesfully to both DB'
            });
        }

        else if(exist && exist2) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Character already exists on both DB'
            });
        }

        else if(exist && !exist2) {
            await this.mySqlService.addCharacter(id);
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Character already exists on MongoDB, succsefully added to MySQL'
            });
        }

        else {
            await this.mongoDBService.addCharacter(id);
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Character already exists on MySQL, succsefully added to MongoDB'
            });
        }
    }

    /*--- Comics ---*/

    @Get('all_comics/:limit/:offset')
    async findAllComics(@Param('limit', ParseIntPipe) limit: number, 
    @Param('offset', ParseIntPipe) offset: number) {

        return await this.marvelService.findAllComicsMDB(limit, offset);
    }

    @Get('comic/:id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        return await this.marvelService.findComicByIdMDB(id); 
    }

    @Get('bycharacters/:ids/:limit/:offset')
    async findByCharacters(@Param('ids', ParseArrayPipe) ids: number[], 
    @Param('limit', ParseIntPipe) limit: number, 
    @Param('offset', ParseIntPipe) offset: number) {

        return await this.marvelService.findComicsContainingCharacterIdMDB(ids, limit, offset);
    }

    @Get('comic_characters/:id')
    async findCharactersById(@Param('id', ParseArrayPipe) id: number) {
        return await this.marvelService.findComicCharactersByComicIdMDB(id);
    }

    @Post('comic_mdb/:id')
    async addMongoDB(@Res() res, @Param('id', ParseIntPipe) id: number) {
        const exist = await this.mongoDBService.findComicByMarvelId(id);

        if(!exist) {
            await this.mongoDBService.addComic(id);
            return res.status(HttpStatus.OK).json({
                message: 'Comic added succesfully to MongoDB'
            }); 
        }

        return res.status(HttpStatus.BAD_REQUEST).json({
            message: 'Comic already exists in MongoDB'
        });
    }

    @Post('comic_sql/:id')
    async addMySQL(@Res() res, @Param('id', ParseIntPipe) id: number) {
        const exist = await this.mySqlService.findComicByMarvelId(id);

        if(!exist) {
            await this.mySqlService.addComic(id);
            return res.status(HttpStatus.OK).json({
                message: 'Comic added succesfully to MySql'
            }); 
        }

        return res.status(HttpStatus.BAD_REQUEST).json({
            message: 'Comic already exists in MySql'
        }); 
    }

    @Post('comic_add/:id')
    async addComic(@Res() res, @Param('id', ParseIntPipe) id: number) {
        const exist = await this.mongoDBService.findComicByMarvelId(id);
        const exist2 = await this.mySqlService.findComicByMarvelId(id);

        if(!exist && !exist2) {
            await this.mongoDBService.addComic(id);
            await this.mySqlService.addComic(id);
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
            await this.mySqlService.addComic(id);
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Comic already exists on MongoDB, succsefully added to MySQL'
            });
        }

        else {
            await this.mongoDBService.addComic(id);
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Comic already exists on MySQL, succsefully added to MongoDB'
            });
        }
    }

    /*--- Both ---*/
    
    @Post('mdb_add/:id')
    async addCharacterAndComicsMDB(@Res() res, @Param('id', ParseIntPipe) id: number) {
        const exist = await this.mongoDBService.findCharacterByMarvelId(id);

        if(!exist){
            const character = await this.mongoDBService.addAllData(id);
            return res.status(HttpStatus.OK).json({
                message: `Character ${character.name} added succesfully to MongoDB`
            }); 
        }

        return res.status(HttpStatus.BAD_REQUEST).json({
            message: `Character with id: ${id} already exist`
        });
    }

    @Get('test/:id')
    async test(@Res() res, @Param('id', ParseIntPipe) id: number) {
        const arr: number[] = await this.marvelService.findAllCharacterComicIdsByCharacterId(id, 0, 0);
        return res.status(HttpStatus.OK).json({
            arreglo: `Ids: ${arr}`,
            largo: `Length: ${arr.length}`
        })
    }
}
