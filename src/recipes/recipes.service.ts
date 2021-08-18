import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Recipe, Role, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipesDto } from './dto/recipes.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipesService {
  private readonly resultsPerPage = 10;

  constructor(private readonly prismaService: PrismaService) {}

  create(createRecipeDto: CreateRecipeDto, authorId: number): Promise<Recipe> {
    return this.prismaService.recipe.create({ data: { ...createRecipeDto, authorId } });
  }

  async findMany(page: number): Promise<RecipesDto> {
    const total = await this.prismaService.recipe.count();
    const skip = (page - 1) * this.resultsPerPage;
    const results = await this.prismaService.recipe.findMany({
      skip,
      take: this.resultsPerPage,
    });
    return {
      total,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: skip + this.resultsPerPage < total ? page + 1 : null,
      results,
    };
  }

  findOne(id: number): Promise<Recipe> {
    return this.prismaService.recipe.findUnique({ where: { id }, rejectOnNotFound: () => new NotFoundException() });
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto, user: User): Promise<Recipe> {
    const recipeToUpdate = await this.findOne(id);
    if (user.role !== Role.ADMIN && recipeToUpdate.authorId !== user.id) throw new ForbiddenException();
    return this.prismaService.recipe.update({ where: { id }, data: updateRecipeDto });
  }

  remove(id: number): Promise<Recipe> {
    return this.prismaService.recipe.delete({ where: { id } });
  }

  async publish(id: number): Promise<void> {
    await this.prismaService.recipe.update({ where: { id }, data: { published: true } });
  }

  async unpublish(id: number): Promise<void> {
    await this.prismaService.recipe.update({ where: { id }, data: { published: false } });
  }
}
