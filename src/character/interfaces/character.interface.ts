import { ComicSummaryInterface } from "src/comic-summary/interfaces/comic-summary.interface";

export class CharacterInterface {
    name: string;
    description: string;
    image: string;
    comics: ComicSummaryInterface[];
  }