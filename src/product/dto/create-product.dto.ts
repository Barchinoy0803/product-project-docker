import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsNumber()
    @IsNotEmpty()
    price: number

    @IsString()
    @IsNotEmpty()
    color: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsString()
    @IsNotEmpty()
    categoryId: string

    @IsString()
    @IsNotEmpty()
    image: string
}

