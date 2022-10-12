import { Schema } from 'mongoose';

export const ComicSchema = new Schema ({
  
    id: {
      type: Number, 
      required: true,
      unique: true
    },
    
    title: {
      type: String,
      required: true
      },
  
    description: {
      type: String,
      default: 'No description'
      },
  
    image: {
      type: String, 
      default: 'https://modogeeks.com/wp-content/uploads/2017/07/Marvel-Logo-1.png'
    },
  
    resourceURI: {
      type: String,
      required: true
    }
  });