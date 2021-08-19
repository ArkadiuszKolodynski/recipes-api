import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  Req,
  DefaultValuePipe,
  Query,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { Prisma, Recipe } from '@prisma/client';
import { Request } from 'express';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { PoliciesGuard } from 'src/auth/guards/policies.guard';
import { CheckPolicies } from 'src/auth/decorators/check-policies.decorator';
import { AppAbility } from 'src/auth/casl/casl-ability.factory';
import { Action } from 'src/auth/casl/action.enum';
import { ParseNaturalIntPipe } from './pipes/parse-natural-int.pipe';
import { RecipesDto } from './dto/recipes.dto';

@ApiBearerAuth('JWT')
@ApiTags('recipes')
@Controller('recipes')
@UseGuards(PoliciesGuard)
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @ApiBadRequestResponse({ description: 'Wrong payload' })
  @Post()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Prisma.ModelName.Recipe))
  create(@Req() req: Request, @Body() createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    return this.recipesService.create(createRecipeDto, req.user.id);
  }

  @ApiBadRequestResponse({ description: 'Page parameter is not natural integer' })
  @ApiNotFoundResponse({ description: 'Provided page parameter exceeds count of pages in the system' })
  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Prisma.ModelName.Recipe))
  findMany(@Query('page', new DefaultValuePipe(1), ParseNaturalIntPipe) page: number): Promise<RecipesDto> {
    return this.recipesService.findMany(page);
  }

  @ApiBadRequestResponse({ description: 'Id is not natural integer' })
  @ApiNotFoundResponse({ description: 'Recipe with provided id not found' })
  @Get(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Prisma.ModelName.Recipe))
  findOne(@Param('id', ParseNaturalIntPipe) id: number): Promise<Recipe> {
    return this.recipesService.findOne(id);
  }

  @ApiBadRequestResponse({ description: 'Id is not natural integer' })
  @ApiNotFoundResponse({ description: 'Recipe with provided id not found' })
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseNaturalIntPipe) id: number,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ): Promise<Recipe> {
    return this.recipesService.update(id, updateRecipeDto, req.user);
  }

  @ApiBadRequestResponse({ description: 'Id is not natural integer' })
  @ApiNotFoundResponse({ description: 'Recipe with provided id not found' })
  @Delete(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Prisma.ModelName.Recipe))
  remove(@Param('id', ParseNaturalIntPipe) id: number): Promise<Recipe> {
    return this.recipesService.remove(id);
  }

  @ApiBadRequestResponse({ description: 'Id is not natural integer' })
  @ApiNotFoundResponse({ description: 'Recipe with provided id not found' })
  @HttpCode(200)
  @Patch(':id/publish')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Publish, Prisma.ModelName.Recipe))
  async publish(@Param('id', ParseNaturalIntPipe) id: number): Promise<void> {
    await this.recipesService.publish(+id);
  }

  @ApiBadRequestResponse({ description: 'Id is not natural integer' })
  @ApiNotFoundResponse({ description: 'Recipe with provided id not found' })
  @HttpCode(200)
  @Patch(':id/unpublish')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Publish, Prisma.ModelName.Recipe))
  async unpublish(@Param('id', ParseNaturalIntPipe) id: number): Promise<void> {
    await this.recipesService.unpublish(+id);
  }
}
