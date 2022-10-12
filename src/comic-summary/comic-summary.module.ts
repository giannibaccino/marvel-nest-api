import { Module } from '@nestjs/common';
import { ComicSummaryService } from './services/comic-summary.service';
import { ComicSummaryController } from './controllers/comic-summary.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { ComicSummarySchema } from './schemas/comic-summary.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComicSummaryEntity } from './entities/comic-summary.entity';

@Module({
  imports: [
    ConfigModule, 
    HttpModule,
    MongooseModule.forFeature([
      {name: 'ComicSummary', schema: ComicSummarySchema}
    ]),
    TypeOrmModule.forFeature([ComicSummaryEntity])
  ],
  providers: [ComicSummaryService],
  controllers: [ComicSummaryController]
})
export class ComicSummaryModule {}
