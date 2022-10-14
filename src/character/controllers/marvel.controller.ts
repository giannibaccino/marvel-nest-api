import { Controller, Get, Param, ParseIntPipe, Post, Res, HttpStatus, ParseArrayPipe, BadRequestException, Put, Delete } from '@nestjs/common';
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

        throw new BadRequestException(`Character with id: ${id} already exist`);
    }

    @Post('sql_add/:id')
    async addCharacterAndComicsSQL(@Res() res, @Param('id', ParseIntPipe) id: number) {
        const exist = await this.mySqlService.findCharacterByMarvelId(id);

        if(!exist){

            try {
                const character = await this.mySqlService.addAllData(id);
            return res.status(HttpStatus.OK).json({
                message: `Character ${character.name} added succesfully to MySQL`
            }); 
                
            } catch (e) {
                if(e == HttpStatus.INTERNAL_SERVER_ERROR)
                   return this.addCharacterAndComicsSQL(res, id);
                throw new BadRequestException('Error en el servidor');
            } 
        }

        throw new BadRequestException(`Character with id: ${id} already exist`);
    }

    /*--- Complete requests ---*/

    @Get('list/:id')
    async getCharacterAndComicsMDB(@Res() res, @Param('id', ParseIntPipe) id: number) {

        const exist = await this.mongoDBService.findCharacterByMarvelId(id);

        if(exist) {

            const character = await this.mongoDBService.findCharacter(id);

            return res.status(HttpStatus.OK).json({
                character
            });
        }
        
        throw new BadRequestException(`Character with id: ${id} doesn't exist on MongoDB`)
    }

    @Post('add/:id')
    async addCharacterAndComicsMDBAndSQL(@Res() res, @Param('id', ParseIntPipe) id: number) {
        const exist = await this.mongoDBService.findCharacterByMarvelId(id);
        const exist2 = await this.mySqlService.findCharacterByMarvelId(id);

        if(!exist && !exist2) {
            const char = await this.mongoDBService.addAllData(id);
            await this.mySqlService.addAllData(id);
            return res.status(HttpStatus.OK).json({
                message: `Character ${char.name} and comics added succesfully to both DB`
            });
        }

        else if(exist && exist2) {
            throw new BadRequestException(`Character with id: ${id} already exist`);
        }

        else if(exist && !exist2) {
            const char = await this.mySqlService.addAllData(id);
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: `Character ${char.name} and comics already exists on MongoDB, succsefully added to MySQL`
            });
        }

        else {
            const char = await this.mongoDBService.addAllData(id);
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: `Character ${char.name} and comics already exists on MySQL, succsefully added to MongoDB`
            });
        }
    }

    @Put('update_name/:id/:newid')
    async updateNameMBDAndSQL(@Res() res, @Param('id', ParseIntPipe) id: number, @Param('newid', ParseIntPipe) newId: number) {
        const exist = await this.mongoDBService.findCharacterByMarvelId(id);
        const exist2 = await this.mySqlService.findCharacterByMarvelId(id);
        const exist3 = await this.marvelService.findCharacterByIdMDB(newId);


        const oldName: string = (await this.mySqlService.findCharacterByMarvelId(id)).name
        
        if(!exist3) {
            throw new BadRequestException(`Character with id: ${newId} doesn't exist on Marvel Api`);
        }

        else if(exist && exist2) {
            const updated = await this.mySqlService.updateName(id, newId);
            await this.mongoDBService.updateName(id, newId);

            return res.status(HttpStatus.OK).json({
                nuevoNombre: `${oldName} now is ${updated.name} on both DB`
            });
        }

        else if(!exist && !exist2) {
            throw new BadRequestException(`Character with id: ${id} doesn't exist on any DB`);
        }
    }

    @Delete('delete/:id')
    async delteCharacterMDBAnsSQL(@Res() res, @Param('id', ParseIntPipe) id: number) {
        
        const exist = await this.mongoDBService.findCharacterByMarvelId(id);
        const exist2 = await this.mySqlService.findCharacterByMarvelId(id);

        if(exist && exist2) {

            const name = await this.mongoDBService.deleteCharacter(id);
            await this.mySqlService.deleteCharacter(id);

            return res.status(HttpStatus.OK).json({
                message: `${name} succesfully deleted from both DB`
            });
        }

        else if(exist && !exist2) {

            const name = await this.mongoDBService.deleteCharacter(id);

            return res.status(HttpStatus.OK).json({
                message: `${name} doesn't exist on MySQL, but was succesfully deleted from both MongoDB`
            });
        }

        else if(!exist && exist2) {

            const name = await this.mySqlService.deleteCharacter(id);

            return res.status(HttpStatus.OK).json({
                message: `${name} doesn't exist on MongoDB, but was succesfully deleted from both MySQL`
            });    
        }

        throw new BadRequestException(`Character with id: ${id} doesn't exist on any DB`)
    }

    /*--- Testing ---*/
    
    @Get('comic_ids_test/:id')
    async test(@Res() res, @Param('id', ParseIntPipe) id: number) {
        const arr: number[] = await this.marvelService.findAllCharacterComicIdsByCharacterId(id, 0, 0);
        return res.status(HttpStatus.OK).json({
            arreglo: `Ids: ${arr}`,
            largo: `Length: ${arr.length}`
        });
    }
}
