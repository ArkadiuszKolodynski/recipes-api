import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { RecipesModule } from 'src/recipes/recipes.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({ node: configService.get<string>('elasticsearchUrl') }),
      inject: [ConfigService],
    }),
    RecipesModule,
    PrismaModule,
  ],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
