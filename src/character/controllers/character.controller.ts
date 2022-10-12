import { Controller, Get, Param, ParseIntPipe, Post, Res, HttpStatus } from '@nestjs/common';
import { CharacterService } from '../services/character.service';
import { CharacterMongoDBService } from '../services/characterMonogoDB.service';
import { CharacterMySqlService } from '../services/characterMySql.service';

@Controller('character')
export class CharacterController {

    constructor(
        private readonly characterService: CharacterService,
        private readonly characterMongoDBService: CharacterMongoDBService,
        private readonly characterMySqlService: CharacterMySqlService
        ) {}

    @Get('n/:name')
    async findByName(@Param('name') name: string) {
        return await this.characterService.findCharacterByName(name);
    }

    @Get('c/:id')
    async findComicsById(@Param('id', ParseIntPipe) id: number) {
        return await this.characterService.findCharacterComicsByCharacterId(id);
    }

    @Get(':limit/:offset')
    async findAll(@Param('limit', ParseIntPipe) limit: number, 
    @Param('offset', ParseIntPipe) offset: number) {

        return await this.characterService.findAllCharacters(limit, offset);
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        return await this.characterService.findCharacterById(id);
    }

    @Post('mdb/:id')
    async addToMongo(@Res() res, @Param('id', ParseIntPipe) id: number) {
        const exist = await this.characterMongoDBService.findByMarvelId(id);

        if(!exist) {
            await this.characterMongoDBService.addCharacter(id);
            return res.status(HttpStatus.OK).json({
                message: 'Character added succesfully to MongoDB'
            });
        }
        return res.status(HttpStatus.BAD_REQUEST).json({
            message: 'Character already exists in MongoDB'
        });
    }

    @Post('sql/:id')
    async addToMySQL(@Res() res, @Param('id', ParseIntPipe) id: number) {
        const exist = await this.characterMySqlService.findByMarvelId(id);

        if(!exist) {
            await this.characterMySqlService.addCharacter(id);
            return res.status(HttpStatus.OK).json({
            message: 'Character added succesfully to MySql'
            });
        }

        return res.status(HttpStatus.BAD_REQUEST).json({
            message: 'Character already exists in MySql'
        });
    }

    @Post('add/:id')
    async addCharacter(@Res() res, @Param('id', ParseIntPipe) id: number) {
        const exist = await this.characterMongoDBService.findByMarvelId(id);
        const exist2 = await this.characterMySqlService.findByMarvelId(id);

        if(!exist && !exist2) {
            await this.characterMongoDBService.addCharacter(id);
            await this.characterMySqlService.addCharacter(id);
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
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Character already exists on MongoDB, succsefully added to MySQL'
            });
        }

        else {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Character already exists on MySQL, succsefully added to MongoDB'
            });
        }
    }
}
