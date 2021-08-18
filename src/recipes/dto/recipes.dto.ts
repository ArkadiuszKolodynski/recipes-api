import { Recipe } from '@prisma/client';

export class RecipesDto {
  total: number;
  nextPage?: number;
  prevPage?: number;
  results: Recipe[];
}
