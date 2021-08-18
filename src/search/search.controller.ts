import { Controller, Get, Param } from '@nestjs/common';
import { Recipe } from '@prisma/client';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get(':query')
  //   @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Prisma.ModelName.Recipe))
  searchByQuery(@Param('query') query: string): Promise<Recipe[]> {
    return this.searchService.searchByQuery(query);
  }
}
