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
        
        // Force IPv4 by using the direct IP address if possible
        // For Supabase, we'll use the connection string approach
        const isProduction = configService.get('NODE_ENV', 'development') === 'production';
        
        if (isProduction && configService.get('DB_SSL', false)) {
          // Use connection string for production with explicit IPv4
          const connectionString = `postgresql://${username}:${password}@${host}:${port}/${database}?sslmode=require&family=4`;
          
          return {
            type: 'postgres',
            url: connectionString,
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: configService.get('DB_SYNCHRONIZE', false),
            logging: false,
            extra: {
              // Force IPv4 connections
              family: 4,
              // Connection timeouts
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
          extra: {
            family: 4,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
