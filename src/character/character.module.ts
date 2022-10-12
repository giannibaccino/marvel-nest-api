import { Module } from '@nestjs/common';
import { CharacterService } from './services/character.service';
import { CharacterController } from './controllers/character.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { CharacterSchema } from './schemas/character.schema';
import { CharacterEntity } from './entities/character.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterMongoDBService } from './services/characterMonogoDB.service';
import { CharacterMySqlService } from './services/characterMySql.service';

@Module({
  imports: [
    ConfigModule, 
    HttpModule,
    MongooseModule.forFeature([
      {name: 'Character', schema: CharacterSchema}
    ]),
    TypeOrmModule.forFeature([CharacterEntity])
  ],
  providers: [CharacterService, CharacterMongoDBService, CharacterMySqlService],
  controllers: [CharacterController]
})
export class CharacterModule {}
