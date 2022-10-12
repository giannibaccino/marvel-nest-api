import { ComicSummaryInterface } from "src/character/interfaces/comic-summary.interface";

export class CharacterInterface {
    name: string;
    description: string;
    image: string;
    comics: ComicSummaryInterface[];
  }