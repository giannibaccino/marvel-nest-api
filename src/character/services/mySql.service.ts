import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CharacterEntity } from "../entities/character.entity";
import { ComicEntity } from "../entities/comic.entity";
import { MarvelService } from "./marvel.service";

@Injectable()
export class MySqlService {

    constructor(
        private readonly marvelService: MarvelService,
        @InjectRepository(CharacterEntity) private characterRepository: Repository<CharacterEntity>,
        @InjectRepository(ComicEntity) private comicRepository: Repository<ComicEntity>
    ) {}

    /*--- Characters ---*/

    async addCharacter(id: number): Promise<CharacterEntity> {
        
        const characterDto = await this.marvelService.findCharacterByIdSQL(id)
        const character = this.characterRepository.create(characterDto); 

        return await this.characterRepository.save(character);
    }

    async findCharacterByMarvelId(id: number): Promise<CharacterEntity> {
        
        return await this.characterRepository.findOneBy({id: id});
    }

    /*--- Comics ---*/

    async addComic(id: number): Promise<ComicEntity> {
        
        const comicDto = await this.marvelService.findComicByIdSQL(id)
        const comic = await this.comicRepository.create(comicDto);  

        return await this.comicRepository.save(comic);
    }

    async findComicByMarvelId(id: number): Promise<ComicEntity> {
        
        return await this.comicRepository.findOneBy({id: id});
    }
}