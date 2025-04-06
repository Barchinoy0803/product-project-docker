import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createProductDto: CreateProductDto) {
    try {
      let product = await this.prisma.product.create({ data: createProductDto })
      return product
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findAll(page = 1, limit = 10, search = '') {
    try {
      const pageNumber = Number(page)
      const limitNumber = Number(limit)

      let products = await this.prisma.product.findMany({
        where: {
          name: {
            startsWith: search,
            mode: 'insensitive'
          }
        },
        include: { category: true },
        skip: (pageNumber - 1) * limitNumber,
        take: limit
      })
      return products
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findOne(id: string) {
    try {
      let product = await this.prisma.product.findUnique({
        where: { id },
        include: { category: true }
      })
      if (!product) return new HttpException("not found", HttpStatus.NOT_FOUND)
      return product
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      let updatedProduct = await this.prisma.product.update({
        data: updateProductDto,
        where: { id }
      })
      return updatedProduct
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async remove(id: string) {
    try {
      let deletedProduct = await this.prisma.product.delete({ where: { id } })
      return deletedProduct
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}
