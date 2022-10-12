import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MarvelModule } from './character/marvel.module';
import { MONGODB_URI, SQL_DB_DATABASE, SQL_DB_HOST, SQL_DB_PASSWORD, SQL_DB_PORT, SQL_DB_USER } from './config/constants';
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    MarvelModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(MONGODB_URI),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>(SQL_DB_HOST),
        port: +configService.get<number>(SQL_DB_PORT),
        username: configService.get<string>(SQL_DB_USER),
        password: configService.get<string>(SQL_DB_PASSWORD),
        database: configService.get<string>(SQL_DB_DATABASE),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: false
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
