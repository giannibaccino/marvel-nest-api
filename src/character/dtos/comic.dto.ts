import { IsNotEmpty, IsString, IsNumber, IsArray } from "class-validator";
import { ObjectId } from "mongoose";
import { CharacterMongoDto, CharacterSqlDto } from "src/character/dtos/character.dto";

export class ComicMongoDto {

    _id: ObjectId;

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

    @IsArray()
    characters: CharacterMongoDto[];
}

export class ComicSqlDto {

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

  @IsArray()
  characters: CharacterSqlDto[];
}