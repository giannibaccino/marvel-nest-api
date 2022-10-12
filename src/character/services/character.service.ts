import { HttpService } from '@nestjs/axios';
import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { map, Observable } from 'rxjs';
import { ComicDto } from 'src/comic/dto/comic.dto';
import { ComicService } from 'src/comic/services/comic.service';
import { Repository } from 'typeorm';
import { HASH, MARVEL_API_URL } from '../../config/constants';
import { CharacterDto } from '../dto/character.dto';
import { CharacterEntity } from '../entities/character.entity';
import { CharacterInterface } from '../interfaces/character.interface';

@Injectable()
export class CharacterService {

    constructor(
        private readonly configService: ConfigService,
        private readonly marvelService: HttpService,
        @InjectModel('Character') private characterModel: Model<CharacterInterface>,
        @InjectRepository(CharacterEntity) private characterRepository: Repository<CharacterEntity>
    ) {}

    async findAllCharacters(limit: number, offset: number): Promise<Observable<CharacterDto[]>> {
        const url = this.configService.get<string>(MARVEL_API_URL) +
         this.configService.get<string>(HASH) + 
         `&limit=${limit}&offset=${offset}`;

        return await this.marvelService.get(url).pipe(
            map((res) => {
                const dtoList = [];

                res.data.data.results.forEach((c) => {
                    const characterDto = new CharacterDto();

                    characterDto.id = c.id;
                    characterDto.name = c.name;
                    
                    dtoList.push(characterDto);
                });
                return dtoList;
           })
        );
    }

    async findCharacterById(id: number): Promise<Observable<CharacterDto>> {
        const url = this.configService.get<string>(MARVEL_API_URL) + `/${id}` + this.configService.get<string>(HASH);

        return await this.marvelService.get(url).pipe(
            map(res => {
                const characterDto = new CharacterDto();
                const character = res.data.data.results
                    .find((character: CharacterDto) => character.id === id);

                    characterDto.id = character.id;
                    characterDto.name = character.name;
                    characterDto.description = character.description;
                    characterDto.image =
                    character.thumbnail.path + '.' + character.thumbnail.extension;
                    characterDto.comics = character.comics.items;
                    
                return characterDto;
            })
        );
    }

    async findCharacterByName(name: String): Promise<Observable<CharacterDto>> {
         const url = this.configService.get<string>(MARVEL_API_URL) +
         this.configService.get<string>(HASH) + 
         `&name=${name}`;

        return await this.marvelService.get(url).pipe(
            map(res => {
                const characterDto = new CharacterDto();
                const character = res.data.data.results
                    .find((character: CharacterDto) => character.name === name);

                    characterDto.id = character.id;
                    characterDto.name = character.name;
                    characterDto.description = character.description;
                    characterDto.image =
                    character.thumbnail.path + '.' + character.thumbnail.extension;

                return characterDto;
            })
        );
    }

    async findCharacterComicsByCharacterId(id: number) :Promise<Observable<ComicDto[]>> {
        const url = this.configService.get<string>(MARVEL_API_URL) + 
        `/${id}/comics` + 
        this.configService.get<string>(HASH);

        return await this.marvelService.get(url).pipe(
            map(res => {
                const comicList = [];

                res.data.data.results.forEach((c) => {
                    const comicDto = new ComicDto();

                    comicDto.id = c.id;
                    comicDto.title = c.title;
                    comicDto.description = c.description;
                    comicDto.image = c.thumbnail.path + '.' + c.thumbnail.extension;
                    comicDto.resourceURI = c.resourceURI;
                    
                    comicList.push(comicDto);
                });

                return comicList;
            })
        )
    }
    
    async addCharacterMongoDB(id: number): Promise<void> {
        
        this.findCharacterById(id)
            .then(res => res.subscribe(async x => {
                const character = new this.characterModel(x);           
                await character.save();
            }));
    }

    async addCharacterMySQL(id: number): Promise<void> {
        
        this.findCharacterById(id)
            .then(res => res.subscribe(async x => {
                const character = this.characterRepository.create(x);              
                await this.characterRepository.save(character);
            }));
    }
}