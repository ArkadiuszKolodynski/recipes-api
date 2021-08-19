import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Timeout } from '@nestjs/schedule';
import { Recipe } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly prismaService: PrismaService,
  ) {}

  async searchByQuery(query: string): Promise<Recipe[]> {
    const { body } = await this.elasticsearchService.search({
      index: 'recipes',
      body: { query: { regexp: { title: '.*' + query + '.*' } } },
    });
    return body.hits.hits.map((recipe: any) => recipe._source);
  }

  /**
   * Syncing PostgreSQL data to ElasticSearch on app startup for test purpose only
   * Normally this job should be done by external software e.g. pgsync
   */
  @Timeout(1000)
  async syncData(): Promise<void> {
    try {
      await this.elasticsearchService.indices.delete({ index: 'recipes' });
    } catch (err) {}
    const recipes = await this.prismaService.recipe.findMany();
    recipes.forEach(async (recipe) => await this.elasticsearchService.index({ index: 'recipes', body: recipe }));
  }
}
