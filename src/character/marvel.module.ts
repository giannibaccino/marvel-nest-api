import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { CharacterSchema } from './schemas/character.schema';
import { CharacterEntity } from './entities/character.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongoDBService } from './services/monogoDB.service';
import { MySqlService } from './services/mySql.service';
import { MarvelService } from './services/marvel.service';
import { MarvelController } from './controllers/marvel.controller';
import { ComicEntity } from './entities/comic.entity';
import { ComicSchema } from './schemas/comic.schema';

@Module({
  imports: [
    ConfigModule, 
    HttpModule,
    MongooseModule.forFeature([
      {name: 'Character', schema: CharacterSchema},
      {name: 'Comic', schema: ComicSchema}
    ]),
    TypeOrmModule.forFeature([CharacterEntity, ComicEntity])
  ],
  providers: [MarvelService, MongoDBService, MySqlService],
  controllers: [MarvelController]
})
export class MarvelModule {}
