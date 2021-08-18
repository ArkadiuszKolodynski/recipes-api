import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Recipe, Role, User } from '@prisma/client';
import { CaslAbilityFactory } from 'src/auth/casl/casl-ability.factory';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(private readonly prismaService: PrismaService, private readonly caslAbilityFactory: CaslAbilityFactory) {}

  create(createRecipeDto: CreateRecipeDto, authorId: number): Promise<Recipe> {
    return this.prismaService.recipe.create({ data: { ...createRecipeDto, authorId } });
  }

  findAll(): Promise<Recipe[]> {
    return this.prismaService.recipe.findMany();
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
