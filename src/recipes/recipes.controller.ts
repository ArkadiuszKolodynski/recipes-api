import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, Req } from '@nestjs/common';
import { Prisma, Recipe } from '@prisma/client';
import { Request } from 'express';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { PoliciesGuard } from 'src/auth/guards/policies.guard';
import { CheckPolicies } from 'src/auth/decorators/check-policies.decorator';
import { AppAbility } from 'src/auth/casl/casl-ability.factory';
import { Action } from 'src/auth/casl/action.enum';

@Controller('recipes')
@UseGuards(PoliciesGuard)
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Prisma.ModelName.Recipe))
  create(@Req() req: Request, @Body() createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    return this.recipesService.create(createRecipeDto, req.user.id);
  }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Prisma.ModelName.Recipe))
  findAll(): Promise<Recipe[]> {
    return this.recipesService.findAll();
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Prisma.ModelName.Recipe))
  findOne(@Param('id') id: string): Promise<Recipe> {
    return this.recipesService.findOne(+id);
  }

  @Patch(':id')
  update(@Req() req: Request, @Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    return this.recipesService.update(+id, updateRecipeDto, req.user);
  }

  @Delete(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Prisma.ModelName.Recipe))
  remove(@Param('id') id: string): Promise<Recipe> {
    return this.recipesService.remove(+id);
  }

  @HttpCode(200)
  @Post(':id/publish')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Publish, Prisma.ModelName.Recipe))
  async publish(@Param('id') id: string): Promise<void> {
    await this.recipesService.publish(+id);
  }

  @HttpCode(200)
  @Post(':id/unpublish')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Publish, Prisma.ModelName.Recipe))
  async unpublish(@Param('id') id: string): Promise<void> {
    await this.recipesService.unpublish(+id);
  }
}
