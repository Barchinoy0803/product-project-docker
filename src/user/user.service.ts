import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcrypt"
import { MailService } from 'src/mail/mail.service';
import { STATUS } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService
  ) { }

  async findByEmail(email: string) {
    try {
      let user = await this.prisma.user.findUnique({ where: { email } })
      return user
    } catch (error) {
      return new InternalServerErrorException(error)
    }
  }

  async register(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const existingUser = await this.findByEmail(email);
    console.log(existingUser);

    if (existingUser) {
      throw new HttpException('User already exists!', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    try {
      await this.mailService.sendOptToEmail(email);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
    }

    return newUser;
  }


  async activate(email: string, otp: string) {
    try {      
      let user = await this.prisma.user.findFirst({ where: { email} })      
      if (!user) return new NotFoundException("Not found")
      if (user.status == STATUS.ACTIVE) return new HttpException("Already activated, please login!", HttpStatus.ALREADY_REPORTED)
      await this.mailService.activate(otp)
      await this.prisma.user.update({
        data: { status: STATUS.ACTIVE },
        where: { email }
      })
      return {message: "Successfully activated✅"}
    } catch (error) {
      return new InternalServerErrorException(error)
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      let { email, password } = loginUserDto
      let user = await this.prisma.user.findUnique({ where: { email } })

      if (!user) return new NotFoundException("Not found this user")

      let matchPassword = bcrypt.compareSync(password, user.password)
      if (!matchPassword) return new HttpException("wrong crediantials", HttpStatus.BAD_REQUEST)

      if (user.status == STATUS.INACTIVE) return new HttpException("Your email is not activated, please activate", HttpStatus.BAD_REQUEST)

      return {
        access_token: this.generateAccessToken({ id: user.id, role: user.role }),
        refresh_token: this.generateRefreshToken({ id: user.id, role: user.role })
      };

    } catch (error) {
      return new InternalServerErrorException(error)
    }
  }

  refreshToken(req: Request) {
    let { id, name } = req['user'];
    return { access_token: this.generateAccessToken({ id, name }) };
  }


  generateRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: '30d'
    })
  }

  generateAccessToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: process.env.ACCESS_KEY,
      expiresIn: '15m',
    });
  }


  async findAll() {
    try {
      let users = await this.prisma.user.findMany()
      return users
    } catch (error) {
      return new InternalServerErrorException(error)
    }
  }

  async findOne(id: string) {
    try {
      let user = await this.prisma.user.findUnique({ where: { id } })
      if (!user) return new NotFoundException("Not found this user")
      return user
    } catch (error) {
      return new InternalServerErrorException(error)
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      let updated = await this.prisma.user.update({
        data: updateUserDto,
        where: { id }
      })
      return updated
    } catch (error) {
      return new InternalServerErrorException(error)
    }
  }

  async remove(id: string) {
    try {
      let deleted = await this.prisma.user.delete({ where: { id } })
      return deleted
    } catch (error) {
      return new InternalServerErrorException(error)
    }
  }
}
