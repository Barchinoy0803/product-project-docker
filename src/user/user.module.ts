import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MailService } from 'src/mail/mail.service';
import { MailModule } from 'src/mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MailModule, ConfigModule, JwtModule.register({ global: true })
  ],
  controllers: [UserController],
  providers: [UserService, MailService],
})
export class UserModule { }
