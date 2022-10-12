import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId, Types } from "mongoose";
import { ComicInterface } from "src/character/interfaces/comic.interface";
import { CharacterMongoDto } from "../dtos/character.dto";
import { ComicMongoDto } from "../dtos/comic.dto";
import { CharacterInterface } from "../interfaces/character.interface";
import { MarvelService } from "./marvel.service";

@Injectable()
export class MongoDBService {

    constructor(
        private readonly marvelService: MarvelService,
        @InjectModel('Character') private characterModel: Model<CharacterInterface>,
        @InjectModel('Comic') private comicModel: Model<ComicInterface>
    ) {}

    /*--- Characters ---*/

    async addCharacter(id: number): Promise<CharacterInterface> {

        const character = new this.characterModel(this.marvelService.findCharacterByIdMDB(id));
        return character.save()
    }

    async findCharacterByMarvelId(id: number): Promise<CharacterInterface> {
        
        return await this.characterModel.findOne({id: id});
    }

    /*--- Comics ---*/

    async addComic(id: number): Promise<ObjectId> {
       
        const comic = new this.comicModel(this.marvelService.findComicByIdMDB(id));          
        await comic.save();
        return comic._id;
    }

    async findComicByMarvelId(id: number): Promise<ComicInterface> {
        
        return await this.comicModel.findOne({id: id}).then(res => res);
    }

    /*--- Both ---*/

    async addAllData(id: number): Promise<CharacterInterface> {
        const characterDto: CharacterMongoDto = await this.marvelService.findCharacterByIdMDB(id);
        const character = new this.characterModel(characterDto);

        const comicIdsNum: number[] = await this.marvelService.findCharacterComicsIdsByCharacterId(id);
        const comicIds: ObjectId[] = [];

        comicIdsNum.forEach(async cid => {
            const exist = await this.findComicByMarvelId(cid);
            
            if(!exist) {
                const comicDto: ComicMongoDto = await this.marvelService.findComicByIdMDB(cid);
                const comic = new this.comicModel(comicDto);
                comicIds.push(comic._id);
                await comic.save();
            }
            
            else {
                comicIds.push(exist._id);
            }
            
            await this.characterModel.findOneAndUpdate({id: id}, {comics: comicIds});   
        })

        return await character.save()
    }
}