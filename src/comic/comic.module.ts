import { Module } from '@nestjs/common';
import { ComicService } from './services/comic.service';
import { ComicController } from './controllers/comic.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { ComicSchema } from './schemas/comic.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComicEntity } from './entities/comic.entity';
import { ComicMongoDBService } from './services/comicMongoDB.service';
import { ComicMySqlService } from './services/comicMySql.service';

@Module({
  imports: [
    ConfigModule, 
    HttpModule,
    MongooseModule.forFeature([
      {name: 'Comic', schema: ComicSchema}
    ]),
    TypeOrmModule.forFeature([ComicEntity])
  ],
  providers: [ComicService, ComicMongoDBService, ComicMySqlService], 
  controllers: [ComicController]
})
export class ComicModule {}
