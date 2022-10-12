import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map, Observable } from 'rxjs';
import { ComicMongoDto, ComicSqlDto } from 'src/character/dtos/comic.dto';
import { HASH, MARVEL_API_URL, MARVEL_COMICS_API_URL } from '../../config/constants';
import { CharacterMongoDto, CharacterSqlDto } from '../dtos/character.dto';

@Injectable()
export class MarvelService {

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {}

    /*--- Characters ---*/

    /*--- MongoDB ---*/

    async findAllCharactersMDB(limit: number, offset: number): Promise<CharacterMongoDto[]> {
        const url = this.configService.get<string>(MARVEL_API_URL) +
         this.configService.get<string>(HASH) + 
         `&limit=${limit}&offset=${offset}`;

        return lastValueFrom( await this.httpService.get(url).pipe(
            map((res) => {
                const dtoList = [];

                res.data.data.results.forEach((c) => {
                    const characterDto = new CharacterMongoDto();

                    characterDto.id = c.id;
                    characterDto.name = c.name;
                    
                    dtoList.push(characterDto);
                });
                return dtoList;
           })
        ));
    }

    async findCharacterByIdMDB(id: number): Promise<CharacterMongoDto> {
        const url = this.configService.get<string>(MARVEL_API_URL) + `/${id}` + this.configService.get<string>(HASH);

        return lastValueFrom(await this.httpService.get(url).pipe(
            map(res => {
                const characterDto = new CharacterMongoDto();
                const character = res.data.data.results
                    .find((character: CharacterMongoDto) => character.id === id);

                    characterDto.id = character.id;
                    characterDto.name = character.name;
                    characterDto.description = character.description;
                    characterDto.image =
                    character.thumbnail.path + '.' + character.thumbnail.extension;
                    
                return characterDto;
            })
        ));
    }

    async findCharacterByNameMDB(name: String): Promise<CharacterMongoDto> {
         const url = this.configService.get<string>(MARVEL_API_URL) +
         this.configService.get<string>(HASH) + 
         `&name=${name}`;

        return lastValueFrom(await this.httpService.get(url).pipe(
            map(res => {
                const characterDto = new CharacterMongoDto();
                const character = res.data.data.results
                    .find((character: CharacterMongoDto) => character.name === name);

                    characterDto.id = character.id;
                    characterDto.name = character.name;
                    characterDto.description = character.description;
                    characterDto.image =
                    character.thumbnail.path + '.' + character.thumbnail.extension;

                return characterDto;
            })
        ));
    }

    async findCharacterComicsByCharacterIdMDB(id: number): Promise<ComicMongoDto[]> {
        const url = this.configService.get<string>(MARVEL_API_URL) + 
        `/${id}/comics` + 
        this.configService.get<string>(HASH);

        return lastValueFrom(this.httpService.get(url).pipe(
            map(res => {
                const comicsIdList = [];

                res.data.data.results.forEach((c) => {
                    const comicDto = new ComicMongoDto();

                    comicDto.id = c.id;
                    comicDto.title = c.title;
                    comicDto.description = c.description;
                    comicDto.image = c.thumbnail.path + '.' + c.thumbnail.extension;
                    comicDto.resourceURI = c.resourceURI;
                    comicDto.characters = c.characters.items;
                    
                    comicsIdList.push(comicDto);
                });

                return comicsIdList;
            })
        ))
    }

    async findCharacterComicsIdsByCharacterId(id: number): Promise<number[]> {
        const url = this.configService.get<string>(MARVEL_API_URL) + 
        `/${id}/comics` + 
        this.configService.get<string>(HASH);

        return lastValueFrom(this.httpService.get(url).pipe(
            map(res => {
                const idList: number[] = [];
                res.data.data.results.forEach(c => idList.push(c.id));
                return idList;
            })
        ))
    }

    getComicIdFromUrlMDB(url: string): number {
        return Number(url.substring(46));
    }

    /*--- MySQL ---*/

    async findAllCharactersSQL(limit: number, offset: number): Promise<CharacterSqlDto[]> {
        const url = this.configService.get<string>(MARVEL_API_URL) +
         this.configService.get<string>(HASH) + 
         `&limit=${limit}&offset=${offset}`;

        return lastValueFrom( await this.httpService.get(url).pipe(
            map((res) => {
                const dtoList = [];

                res.data.data.results.forEach((c) => {
                    const characterDto = new CharacterSqlDto();

                    characterDto.id = c.id;
                    characterDto.name = c.name;
                    
                    dtoList.push(characterDto);
                });
                return dtoList;
           })
        ));
    }

    async findCharacterByIdSQL(id: number): Promise<CharacterSqlDto> {
        const url = this.configService.get<string>(MARVEL_API_URL) + `/${id}` + this.configService.get<string>(HASH);

        return lastValueFrom(await this.httpService.get(url).pipe(
            map(res => {
                const characterDto = new CharacterSqlDto();
                const character = res.data.data.results
                    .find((character: CharacterSqlDto) => character.id === id);

                    characterDto.id = character.id;
                    characterDto.name = character.name;
                    characterDto.description = character.description;
                    characterDto.image =
                    character.thumbnail.path + '.' + character.thumbnail.extension;
                    
                return characterDto;
            })
        ));
    }

    async findCharacterByNameSQL(name: String): Promise<Observable<CharacterSqlDto>> {
         const url = this.configService.get<string>(MARVEL_API_URL) +
         this.configService.get<string>(HASH) + 
         `&name=${name}`;

        return await this.httpService.get(url).pipe(
            map(res => {
                const characterDto = new CharacterSqlDto();
                const character = res.data.data.results
                    .find((character: CharacterSqlDto) => character.name === name);

                    characterDto.id = character.id;
                    characterDto.name = character.name;
                    characterDto.description = character.description;
                    characterDto.image =
                    character.thumbnail.path + '.' + character.thumbnail.extension;

                return characterDto;
            })
        );
    }

    async findCharacterComicsByCharacterIdSQL(id: number): Promise<CharacterSqlDto[]> {
        const url = this.configService.get<string>(MARVEL_API_URL) + 
        `/${id}/comics` + 
        this.configService.get<string>(HASH);

        return lastValueFrom(await this.httpService.get(url).pipe(
            map(res => {
                const comicsIdList = [];

                res.data.data.results.forEach((c) => {
                    const comicDto = new ComicSqlDto();

                    comicDto.id = c.id;
                    comicDto.title = c.title;
                    comicDto.description = c.description;
                    comicDto.image = c.thumbnail.path + '.' + c.thumbnail.extension;
                    comicDto.resourceURI = c.resourceURI;
                    comicDto.characters = c.characters.items;
                    
                    comicsIdList.push(comicDto);
                });

                return comicsIdList;
            })
        ))
    }

    /*--- Comics ---*/

    /*--- MongoDB ---*/

    async findAllComicsMDB(limit: number, offset: number): Promise<ComicMongoDto[]> {
        const url = this.configService.get<string>(MARVEL_COMICS_API_URL) +
         this.configService.get<string>(HASH) + 
         `&limit=${limit}&offset=${offset}`;

        return lastValueFrom(await this.httpService.get(url).pipe(
            map((res) => {
                const dtoList = [];

                res.data.data.results.forEach((c) => {
                    const comicDto = new ComicMongoDto();

                    comicDto.id = c.id;
                    comicDto.title = c.title;
                    
                    dtoList.push(comicDto);
                });
                return dtoList;
           })
        ));
    }

    async findComicByIdMDB(id: number): Promise<ComicMongoDto> {
        const url = this.configService.get<string>(MARVEL_COMICS_API_URL) +
         `/${id}` +
         this.configService.get<string>(HASH);

         return lastValueFrom(await this.httpService.get(url).pipe(
            map(res => {
                const comicDto = new ComicMongoDto();
                const comic = res.data.data.results
                    .find((comic: ComicMongoDto) => comic.id === id);

                    comicDto.id = comic.id;
                    comicDto.title = comic.title;
                    comicDto.description = comic.description;
                    comicDto.image =
                    comic.thumbnail.path + '.' + comic.thumbnail.extension;
                    comicDto.resourceURI = comic.resourceURI;

                return comicDto;
            })
        ));
    }

    async findComicsContainingCharacterIdMDB(ids: number[], limit: number, offset: number): Promise<ComicMongoDto[]> {
        const url = this.configService.get<string>(MARVEL_COMICS_API_URL) +
         this.configService.get<string>(HASH) + 
         `&limit=${limit}&offset=${offset}&characters=${ids}`;

         return lastValueFrom (await this.httpService.get(url).pipe(
            map((res) => {
                const dtoList = [];

                res.data.data.results.forEach((c) => {
                    const comicDto = new ComicMongoDto();

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
         ));
    }

    async findComicByUrlMDB(url: string): Promise<ComicMongoDto> {
        return lastValueFrom(await this.httpService.get(url).pipe(
            map(res => {
                const comicDto = new ComicMongoDto();
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
        ));
    }

    async findComicCharactersByComicIdMDB(id: number): Promise<CharacterMongoDto[]> {
        const url = this.configService.get<string>(MARVEL_COMICS_API_URL) + 
        `/${id}/characters` + 
        this.configService.get<string>(HASH);

        return lastValueFrom(await this.httpService.get(url).pipe(
            map(res => {
                const characterList = [];

                res.data.data.results.forEach((c) => {
                    const characterDto = new CharacterMongoDto();

                    characterDto.id = c.id;
                    characterDto.name = c.name;
                    characterDto.description = c.description;
                    characterDto.image = c.thumbnail.path + '.' + c.thumbnail.extension;
                    characterDto.comics = c.comics.items;
                    
                    characterList.push(characterDto);
                });

                return characterList;
            })
        ))
    }

    /*--- MySQL ---*/

    async findAllComicsSQL(limit: number, offset: number): Promise<ComicSqlDto[]> {
        const url = this.configService.get<string>(MARVEL_COMICS_API_URL) +
         this.configService.get<string>(HASH) + 
         `&limit=${limit}&offset=${offset}`;

        return lastValueFrom(await this.httpService.get(url).pipe(
            map((res) => {
                const dtoList = [];

                res.data.data.results.forEach((c) => {
                    const comicDto = new ComicSqlDto();

                    comicDto.id = c.id;
                    comicDto.title = c.title;
                    
                    dtoList.push(comicDto);
                });
                return dtoList;
           })
        ));
    }

    async findComicByIdSQL(id: number): Promise<ComicSqlDto> {
        const url = this.configService.get<string>(MARVEL_COMICS_API_URL) +
         `/${id}` +
         this.configService.get<string>(HASH);

         return lastValueFrom(await this.httpService.get(url).pipe(
            map(res => {
                const comicDto = new ComicSqlDto();
                const comic = res.data.data.results
                    .find((comic: ComicSqlDto) => comic.id === id);

                    comicDto.id = comic.id;
                    comicDto.title = comic.title;
                    comicDto.description = comic.description;
                    comicDto.image =
                    comic.thumbnail.path + '.' + comic.thumbnail.extension;
                    comicDto.resourceURI = comic.resourceURI;

                return comicDto;
            })
        ));
    }

    async findComicsContainingCharacterIdSQL(ids: number[], limit: number, offset: number): Promise<ComicSqlDto[]> {
        const url = this.configService.get<string>(MARVEL_COMICS_API_URL) +
         this.configService.get<string>(HASH) + 
         `&limit=${limit}&offset=${offset}&characters=${ids}`;

         return lastValueFrom (await this.httpService.get(url).pipe(
            map((res) => {
                const dtoList = [];

                res.data.data.results.forEach((c) => {
                    const comicDto = new ComicSqlDto();

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
         ));
    }

    async findComicByUrlSQL(url: string): Promise<ComicSqlDto> {
        return lastValueFrom(await this.httpService.get(url).pipe(
            map(res => {
                const comicDto = new ComicSqlDto();
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
        ));
    }

    async findComicCharactersByComicIdSQL(id: number): Promise<ComicSqlDto[]> {
        const url = this.configService.get<string>(MARVEL_COMICS_API_URL) + 
        `/${id}/characters` + 
        this.configService.get<string>(HASH);

        return lastValueFrom(await this.httpService.get(url).pipe(
            map(res => {
                const characterList = [];

                res.data.data.results.forEach((c) => {
                    const characterDto = new CharacterSqlDto();

                    characterDto.id = c.id;
                    characterDto.name = c.name;
                    characterDto.description = c.description;
                    characterDto.image = c.thumbnail.path + '.' + c.thumbnail.extension;
                    characterDto.comics = c.comics.items;
                    
                    characterList.push(characterDto);
                });

                return characterList;
            })
        ))
    }
}
