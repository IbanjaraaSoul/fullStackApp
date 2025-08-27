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
          // Try multiple connection approaches for production
          const configs = [
            // Approach 1: Connection string with IPv4 enforcement
            {
              type: 'postgres' as const,
              url: `postgresql://${username}:${password}@${host}:${port}/${database}?sslmode=require&family=4`,
              entities: [__dirname + '/../**/*.entity{.ts,.js}'],
              synchronize: configService.get('DB_SYNCHRONIZE', false),
              logging: false,
              extra: {
                family: 4,
                connectionTimeoutMillis: 10000,
                query_timeout: 10000,
                statement_timeout: 10000,
              },
            },
            // Approach 2: Direct configuration with aggressive IPv4
            {
              type: 'postgres' as const,
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
                family: 4,
                connectionTimeoutMillis: 10000,
                query_timeout: 10000,
                statement_timeout: 10000,
                // Force IPv4 at the socket level
                socket: {
                  family: 4,
                },
              },
            }
          ];
          
          // Return the first configuration (connection string approach)
          return configs[0];
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
