import { Injectable } from '@nestjs/common';
import { CharacterService } from './character/services/character.service';
import { ComicService } from './comic/services/comic.service';

@Injectable()
export class AppService {
  
  // constructor(
  //   private readonly characterService: CharacterService,
  //   private readonly comicService: ComicService,
  // ) {}

  // async addFull(id: number){
  //   await this.characterService.addCharacterMongoDB(id);
  //   await this.characterService.findByIdInMongoDB(id)
  // }
}
