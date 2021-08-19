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
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('JWT')
@ApiTags('users')
@Controller('users')
@UseGuards(PoliciesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBadRequestResponse({ description: 'Id is not natural integer' })
  @ApiNotFoundResponse({ description: 'User with provided id not found' })
  @Patch(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Prisma.ModelName.User))
  update(@Param('id', ParseNaturalIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<UserDto> {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiBadRequestResponse({ description: 'Id is not natural integer' })
  @ApiNotFoundResponse({ description: 'User with provided id not found' })
  @Delete(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Prisma.ModelName.User))
  remove(@Param('id', ParseNaturalIntPipe) id: number): Promise<UserDto> {
    return this.usersService.remove(+id);
  }
}
