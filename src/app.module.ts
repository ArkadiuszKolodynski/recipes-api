import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RecipesModule } from './recipes/recipes.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, RecipesModule, UsersModule, AuthModule],
})
export class AppModule {}
