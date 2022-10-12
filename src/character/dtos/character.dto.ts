import { ComicSummaryDto } from "./comic-summary.dto";
import { IsNotEmpty, IsString, IsNumber } from "class-validator";
export class CharacterDto {

    @IsNumber()
    @IsNotEmpty()
    id:number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    description: string;

    @IsString()
    image: string;

    comics: ComicSummaryDto[]
  }