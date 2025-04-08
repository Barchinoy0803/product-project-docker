import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { MailModule } from './mail/mail.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis'

@Module({
  imports: [
    UserModule,
    ProductModule,
    CategoryModule,
    MailModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      ttl: 60 * 1000,
      isGlobal: true,
      store: redisStore,
      host: '172.17.0.2',
      port: 6379
    })
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
