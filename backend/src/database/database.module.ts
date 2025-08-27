import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'password'),
        database: configService.get('DB_NAME', 'fullstackapp'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get('DB_SYNCHRONIZE', configService.get('NODE_ENV', 'development') === 'development'),
        logging: configService.get('NODE_ENV', 'development') === 'development',
        ssl: configService.get('DB_SSL', false) ? { rejectUnauthorized: false } : false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
