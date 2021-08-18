import { Controller, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PoliciesGuard } from 'src/auth/guards/policies.guard';
import { CheckPolicies } from 'src/auth/decorators/check-policies.decorator';
import { Prisma } from '@prisma/client';
import { Action } from 'src/auth/casl/action.enum';
import { AppAbility } from 'src/auth/casl/casl-ability.factory';
import { UserDto } from './dto/user.dto';
import { ParseNaturalIntPipe } from 'src/recipes/pipes/parse-natural-int.pipe';

@Controller('users')
@UseGuards(PoliciesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Prisma.ModelName.User))
  update(@Param('id', ParseNaturalIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<UserDto> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Prisma.ModelName.User))
  remove(@Param('id', ParseNaturalIntPipe) id: number): Promise<UserDto> {
    return this.usersService.remove(+id);
  }
}
