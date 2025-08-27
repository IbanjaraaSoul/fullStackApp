import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const host = configService.get('DB_HOST', 'localhost');
        const port = configService.get('DB_PORT', 5432);
        const username = configService.get('DB_USERNAME', 'postgres');
        const password = configService.get('DB_PASSWORD', 'password');
        const database = configService.get('DB_NAME', 'fullstackapp');
        
        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: configService.get('DB_SYNCHRONIZE', configService.get('NODE_ENV', 'development') === 'development'),
          logging: configService.get('NODE_ENV', 'development') === 'development',
          ssl: configService.get('DB_SSL', false) ? { rejectUnauthorized: false } : false,
          extra: {
            // Force IPv4 connections and disable IPv6
            family: 4,
            // Additional connection options
            connectionTimeoutMillis: 10000,
            query_timeout: 10000,
            statement_timeout: 10000,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
