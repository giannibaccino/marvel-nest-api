import { Schema } from 'mongoose';

export const ComicSummarySchema = new Schema ({

    name: {
      type: String,
       required: true
      },
  
    resourceURI: {
      type: String,
       required: true
      }
  });