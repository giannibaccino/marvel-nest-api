import { Schema } from 'mongoose';
import { ComicSummarySchema } from 'src/comic-summary/schemas/comic-summary.schema';

export const CharacterSchema = new Schema ({
  
  id: {
    type: Number, 
    required: true,
    unique: true
  },
  
  name: {
    type: String,
    required: true
    },

  description: {
    type: String,
    default: 'No description'
    },

  image: {
    type: String, 
    default: 'https://modogeeks.com/wp-content/uploads/2017/07/Marvel-Logo-1.png'},

  comics: [ComicSummarySchema]
});