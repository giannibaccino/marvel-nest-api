import { ComicSummaryDto } from "src/comic-summary/dto/comic-summary.dto";
import { ComicDto } from "src/comic/dto/comic.dto";

export class CharacterDto {
    id:number;
    name: string;
    description: string;
    image: string;
    comics: ComicSummaryDto[]
  }