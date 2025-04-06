import { ROLE } from "@prisma/client"
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator"

export class LoginUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsStrongPassword()
    @IsNotEmpty()
    password: string
}
