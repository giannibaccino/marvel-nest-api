import { IsNotEmpty, IsString } from "class-validator";

export class ComicSummaryDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    resourceURI: string;
  }