import { Controller, Get, Param, ParseIntPipe, Post, Res, HttpStatus } from '@nestjs/common';
import { CharacterService } from '../services/character.service';

@Controller('character')
export class CharacterController {

    constructor(private readonly characterService: CharacterService) {}

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
        const character = await this.characterService.addCharacterMongoDB(id);
        return res.status(HttpStatus.OK).json({
            message: 'Character added succesfully'
        })
    }

    @Post('sql/:id')
    async addToMySQL(@Res() res, @Param('id', ParseIntPipe) id: number) {
        const character = await this.characterService.addCharacterMySQL(id);
        return res.status(HttpStatus.OK).json({
            message: 'Character added succesfully'
        })
    }

    @Post('add/:id')
    async addCharacter(@Res() res, @Param('id', ParseIntPipe) id: number) {
        await this.characterService.addCharacterMongoDB(id);
        await this.characterService.addCharacterMySQL(id);
        return res.status(HttpStatus.OK).json({
            message: 'Character added succesfully'
        })
    }
}
