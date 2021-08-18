import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Recipe } from '@prisma/client';
import { SearchService } from './search.service';

@ApiBearerAuth('JWT')
@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * Performs partial text search on recipes title
   */
  @Get(':query')
  searchByQuery(@Param('query') query: string): Promise<Recipe[]> {
    return this.searchService.searchByQuery(query);
  }
}
