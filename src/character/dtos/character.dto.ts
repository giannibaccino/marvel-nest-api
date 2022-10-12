import { IsNotEmpty, IsString, IsNumber, IsArray } from "class-validator";
import { ObjectId } from "mongoose";

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

    @IsArray()
    comics: ObjectId[]
  }

export class CharacterSqlDto {

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

    @IsArray()
    comics: ObjectId[]
  }