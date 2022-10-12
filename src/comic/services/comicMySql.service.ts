import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ComicEntity } from "../entities/comic.entity";
import { ComicService } from "./comic.service";

@Injectable()
export class ComicMySqlService {

    constructor(
        private readonly marvelService: ComicService,
        @InjectRepository(ComicEntity) private comicRepository: Repository<ComicEntity>
    ) {}

    async addComic(id: number): Promise<void> {
        
        this.marvelService.findComicById(id)
            .then(res => res.subscribe(async x => {
                const comic = this.comicRepository.create(x);              
                await this.comicRepository.save(comic);
            }));
    }

    async findByMarvelId(id: number): Promise<ComicEntity> {
        
        return await this.comicRepository.findOneBy({id: id});
    }
}