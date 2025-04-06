import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { totp } from 'otplib';


@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService
    ) {
        totp.options = { step: 600, digits: 6 }
    }

    async sendOptToEmail(email: string) {
        try {
            const OTP_SECRET = this.configService.get<string>('OTP_SECRET')
            const otp = totp.generate(OTP_SECRET!)
            await this.mailerService.sendMail({
                to: email,
                subject: "OTP verification",
                html: `<h1>Your otp is <strong>${otp}</strong></h1><p>This otp is valid for 10 minutes</p>`
            })
            return { message: "Otp send successfully✅" }
        } catch (error) {
            return new BadRequestException(error)
        }
    }

    async activate(otp: string) {
        const OTP_SECRET = this.configService.get<string>('OTP_SECRET')
        const isValid = totp.check(otp, OTP_SECRET!)
        if (!isValid) return { message: "Invalid otp" }
        return { message: "Your otp is successfully verified✅" }
    }
}
