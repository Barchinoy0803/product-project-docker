import { ROLE, STATUS } from "@prisma/client"
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator"

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstname: string

    @IsString()
    @IsNotEmpty()
    lastname: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsStrongPassword()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsOptional()
    image: string

    @IsOptional()
    @IsEnum(ROLE)
    role: ROLE

    @IsOptional()
    @IsEnum(STATUS)
    status: STATUS
}
