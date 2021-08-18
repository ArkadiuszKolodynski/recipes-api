import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { RecipesModule } from 'src/recipes/recipes.module';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: 'http://172.24.97.84:9200',
    }),
    RecipesModule,
  ],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
