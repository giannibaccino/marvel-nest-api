import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CharacterEntity } from "../entities/character.entity";
import { CharacterService } from "./character.service";

@Injectable()
export class CharacterMySqlService {

    constructor(
        private readonly marvelService: CharacterService,
        @InjectRepository(CharacterEntity) private characterRepository: Repository<CharacterEntity>
    ) {}

    async addCharacter(id: number): Promise<void> {
        
        this.marvelService.findCharacterById(id)
            .then(res => res.subscribe(async x => {
                const character = this.characterRepository.create(x);              
                await this.characterRepository.save(character);
            }));
    }

    async findByMarvelId(id: number): Promise<CharacterEntity> {
        
        return await this.characterRepository.findOneBy({id: id});
    }
}