import { ObjectId } from "mongoose";
import { CharacterInterface } from "src/character/interfaces/character.interface";

export class ComicInterface {
    _id: ObjectId;
    title: string;
    description: string;
    image: string;
    resourceURI: string;
    characters: CharacterInterface[];
  }