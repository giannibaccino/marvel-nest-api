import { IsNotEmpty, IsString, IsNumber, IsArray } from "class-validator";
import { ObjectId } from "mongoose";
import { ComicEntity } from "../entities/comic.entity";

export class CharacterMongoDto {

    _id: ObjectId;

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

    @IsNumber()
    comicAmount: number;

    @IsArray()
    comics: ObjectId[]
  }

export class CharacterSqlDto {

    // @IsString()
    // @IsNotEmpty()
    // _id: string;

    @IsNumber()
    @IsNotEmpty()
    char_id:number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    description: string;

    @IsString()
    image: string;

    @IsNumber()
    comicAmount: number;

    @IsArray()
    comics: ComicEntity[];
  }