import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      let category = await this.prisma.category.create({ data: createCategoryDto })
      return category
    } catch (error) {
      return new InternalServerErrorException(error)
    }
  }

  async findAll(page = 1, limit = 10, search = '') {
    try {
      const pageNumber = Number(page)
      const limitNumber = Number(limit)

      let categories = await this.prisma.category.findMany({
        where: {
          name: {
            startsWith: search,
            mode: 'insensitive'
          }
        },
        include: { Product: true },
        skip: (pageNumber - 1) * limitNumber,
        take: limit
      })
      return categories
    } catch (error) {
      return new InternalServerErrorException(error)
    }
  }

  async findOne(id: string) {
    try {
      let category = await this.prisma.category.findUnique({
        where: { id },
        include: { Product: true }
      })
      if (!category) return new HttpException("Not found", HttpStatus.NOT_FOUND)
      return category
    } catch (error) {
      return new InternalServerErrorException(error)
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      let updatedCategory = await this.prisma.category.update({
        data: updateCategoryDto,
        where: { id }
      })
      return updatedCategory
    } catch (error) {
      return new InternalServerErrorException(error)
    }
  }

  async remove(id: string) {
    try {
      let deletedProduct = await this.prisma.category.delete({ where: { id } })
      return deletedProduct
    } catch (error) {
      return new InternalServerErrorException(error)
    }
  }
}
