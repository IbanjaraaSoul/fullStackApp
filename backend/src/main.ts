import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Force IPv4 connections before starting the app
  if (process.env.NODE_ENV === 'production') {
    // Set Node.js options to prefer IPv4
    process.env.NODE_OPTIONS = '--dns-result-order=ipv4first';
    
    // Override the default DNS resolution to prefer IPv4
    const dns = require('dns');
    const originalLookup = dns.lookup;
    
    dns.lookup = function(hostname: string, options: any, callback: any) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      
      // Force IPv4 family
      options.family = 4;
      
      return originalLookup(hostname, options, callback);
    };
  }
  
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();
