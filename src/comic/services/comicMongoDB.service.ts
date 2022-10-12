import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ComicInterface } from "../interfaces/comic.interface";
import { ComicService } from "./comic.service";

@Injectable()
export class ComicMongoDBService {

    constructor(
        private readonly marvelService: ComicService,
        @InjectModel('Comic') private comicModel: Model<ComicInterface>,
    ) {}

    async addComic(id: number): Promise<void> {
        
        this.marvelService.findComicById(id)
            .then(res => res.subscribe(async x => {
                const comic = new this.comicModel(x);           
                await comic.save();
            }));  
    }

    async findByMarvelId(id: number): Promise<ComicInterface> {
        
        return await this.comicModel.findOne({id: id}).then(res => res);
    }
}