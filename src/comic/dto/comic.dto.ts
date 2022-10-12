import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class ComicDto {

    @IsNumber()
    @IsNotEmpty()
    id:number;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    description: string;

    @IsString()
    image: string;

    @IsString()
    @IsNotEmpty()
    resourceURI: string;
  }