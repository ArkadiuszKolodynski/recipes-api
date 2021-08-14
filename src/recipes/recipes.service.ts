import { Injectable } from '@nestjs/common';
import { Recipe } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    return this.prismaService.recipe.create({ data: createRecipeDto });
  }

  findAll(): Promise<Recipe[]> {
    return this.prismaService.recipe.findMany();
  }

  findOne(id: number): Promise<Recipe> {
    return this.prismaService.recipe.findUnique({ where: { id } });
  }

  update(id: number, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    return this.prismaService.recipe.update({ where: { id }, data: updateRecipeDto });
  }

  remove(id: number): Promise<Recipe> {
    return this.prismaService.recipe.delete({ where: { id } });
  }
}
