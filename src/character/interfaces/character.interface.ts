import mongoose, { ObjectId } from "mongoose";

export class CharacterInterface {
    _id: ObjectId;
    name: string;
    description: string;
    image: string;
    comicAmount: number;
    comics: ObjectId[];
  }