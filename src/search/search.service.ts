import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Recipe } from '@prisma/client';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async searchByQuery(query: string): Promise<Recipe[]> {
    const { body } = await this.elasticsearchService.search({
      index: 'recipes',
      body: { query: { regexp: { title: '.*' + query + '.*' } } },
    });
    return body.hits.hits.map((recipe: any) => recipe._source);
  }
}
