import { HttpService } from '@nestjs/axios';
import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { map, Observable } from 'rxjs';
import { HASH, MARVEL_COMICS_API_URL } from 'src/config/constants';
import { Repository } from 'typeorm';
import { ComicDto } from '../dto/comic.dto';
import { ComicEntity } from '../entities/comic.entity';
import { ComicInterface } from '../interfaces/comic.interface';

@Injectable()
export class ComicService {

    constructor(
        private readonly configService: ConfigService,
        private readonly marvelService: HttpService,
        @InjectModel('Comic') private comicModel: Model<ComicInterface>,
        @InjectRepository(ComicEntity) private comicRepository: Repository<ComicEntity>
    ) {}

    async findAllComics(limit: number, offset: number): Promise<Observable<ComicDto[]>> {
        const url = this.configService.get<string>(MARVEL_COMICS_API_URL) +
         this.configService.get<string>(HASH) + 
         `&limit=${limit}&offset=${offset}`;

        return await this.marvelService.get(url).pipe(
            map((res) => {
                const dtoList = [];

                res.data.data.results.forEach((c) => {
                    const comicDto = new ComicDto();

                    comicDto.id = c.id;
                    comicDto.title = c.title;
                    
                    dtoList.push(comicDto);
                });
                return dtoList;
           })
        );
    }

    async findComicById(id: number): Promise<Observable<ComicDto>> {
        const url = this.configService.get<string>(MARVEL_COMICS_API_URL) +
         `/${id}` +
         this.configService.get<string>(HASH);

         return await this.marvelService.get(url).pipe(
            map(res => {
                const comicDto = new ComicDto();
                const comic = res.data.data.results
                    .find((comic: ComicDto) => comic.id === id);

                    comicDto.id = comic.id;
                    comicDto.title = comic.title;
                    comicDto.description = comic.description;
                    comicDto.image =
                    comic.thumbnail.path + '.' + comic.thumbnail.extension;
                    comicDto.resourceURI = comic.resourceURI;

                return comicDto;
            })
        );
    }

    async findComicsContainingCharacterId(ids: number[], limit: number, offset: number): Promise<Observable<ComicDto[]>> {
        const url = this.configService.get<string>(MARVEL_COMICS_API_URL) +
         this.configService.get<string>(HASH) + 
         `&limit=${limit}&offset=${offset}&characters=${ids}`;

         return await this.marvelService.get(url).pipe(
            map((res) => {
                const dtoList = [];

                res.data.data.results.forEach((c) => {
                    const comicDto = new ComicDto();

                    comicDto.id = c.id;
                    comicDto.title = c.title;
                    comicDto.description = c.description;
                    comicDto.image =
                    c.thumbnail.path + '.' + c.thumbnail.extension;
                    comicDto.resourceURI = c.resourceURI;
                    
                    dtoList.push(comicDto);
                });
                return dtoList;
           })
        );
    }

    async findComicByLink(url: string): Promise<Observable<ComicDto>> {
        return await this.marvelService.get(url).pipe(
            map(res => {
                const comicDto = new ComicDto();
                const comic = res.data.data.results;

                    comicDto.id = comic.id;
                    comicDto.title = comic.title;
                    comicDto.description = comic.description;
                    comicDto.image =
                    comic.thumbnail.path + '.' + comic.thumbnail.extension;
                    comicDto.resourceURI = comic.resourceURI;
                    console.log(comicDto);
                    

                return comicDto;
            })
        );
    }

    async addComicMongoDB(id: number): Promise<void> {

        this.findComicById(id)
        .then(res => res.subscribe( async x => {
            const comic = new this.comicModel(x);
            await comic.save();
        }))
    }

    async addComicMySQL(id: number): Promise<void> {

        this.findComicById(id)
        .then(res => res.subscribe(async x => {
            const comic = this.comicRepository.create(x);
            await this.comicRepository.save(comic);
        }))
    }
}
