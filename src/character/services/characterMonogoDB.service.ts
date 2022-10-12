import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CharacterInterface } from "../interfaces/character.interface";
import { CharacterService } from "./character.service";

@Injectable()
export class CharacterMongoDBService {

    constructor(
        private readonly marvelService: CharacterService,
        @InjectModel('Character') private characterModel: Model<CharacterInterface>,
    ) {}

    async addCharacter(id: number): Promise<void> {
        
        this.marvelService.findCharacterById(id)
            .then(res => res.subscribe(async x => {
                const character = new this.characterModel(x);           
                await character.save();
            }));  
    }

    async findByMarvelId(id: number): Promise<CharacterInterface> {
        
        return await this.characterModel.findOne({id: id}).then(res => res);
    }
}