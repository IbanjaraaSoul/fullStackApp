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
        
        const isProduction = configService.get('NODE_ENV', 'development') === 'production';
        
        if (isProduction && configService.get('DB_SSL', false)) {
          // Production configuration for Neon
          return {
            type: 'postgres',
            host,
            port,
            username,
            password,
            database,
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: configService.get('DB_SYNCHRONIZE', false),
            logging: false,
            ssl: { rejectUnauthorized: false },
            extra: {
              connectionTimeoutMillis: 10000,
              query_timeout: 10000,
              statement_timeout: 10000,
            },
          };
        }
        
        // Development configuration
        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: configService.get('DB_SYNCHRONIZE', true),
          logging: true,
          ssl: false,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
