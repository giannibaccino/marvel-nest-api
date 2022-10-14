import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CharacterSqlDto } from "../dtos/character.dto";
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
        
        return await this.characterRepository.findOneBy({char_id: id});
    }

    /*--- Comics ---*/

    async addComic(id: number): Promise<ComicEntity> {
        
        const comicDto = await this.marvelService.findComicByIdSQL(id)
        const comic = this.comicRepository.create(comicDto);  

        return await this.comicRepository.save(comic);
    }

    async findComicByMarvelId(id: number): Promise<ComicEntity> {
        
        return await this.comicRepository.findOneBy({com_id: id});
    }

    /*--- Both ---*/

    async addAllData(id: number): Promise<CharacterEntity> {

        const comicIds: number[] = await this.marvelService.findAllCharacterComicIdsByCharacterId(id, 0, 0);

        const comicListPromise = comicIds.map(async cid => {
            const exist = await this.findComicByMarvelId(cid);

            if(!exist) {
                return await this.addComic(cid);
            }
            
            return exist;
        });

        const comicList = await Promise.all(comicListPromise);
        
        const characterDto: CharacterSqlDto = await this.marvelService.findCharacterByIdSQL(id);
        
        characterDto.comics = comicList;
        characterDto.comicAmount = comicList.length;
        const character = this.characterRepository.create(characterDto);

        return await this.characterRepository.save(character);
    }

    async updateName(id:number, newId: number): Promise<CharacterEntity> {
        
        const newName = (await this.marvelService.findCharacterByIdSQL(newId)).name;
        
        const updated = await this.characterRepository
            .createQueryBuilder()
            .update(CharacterEntity)
            .set({name: newName})
            .where({char_id: id})
            .execute();

        return await this.findCharacterByMarvelId(id);
    }

    async deleteCharacter(id: number): Promise<string> {

        const name = (await this.findCharacterByMarvelId(id)).name;
        
        await this.characterRepository
        .createQueryBuilder()
        .delete()
        .from(CharacterEntity)
        .where({char_id: id})
        .execute()

        return name;
    }

    async findCharacter(id: number): Promise<CharacterEntity> {
        
        return await this.characterRepository.findOneBy({char_id: id});
    }
}