import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Prisma, Recipe, Role, User } from '@prisma/client';
import { Action } from './action.enum';

type Subjects = Recipe | User | Prisma.ModelName | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>);

    if (user.role === Role.ADMIN) {
      can(Action.Manage, 'all');
    } else {
      can(Action.Read, 'all');
    }

    can(Action.Create, Prisma.ModelName.Recipe);
    can(Action.Update, Prisma.ModelName.Recipe, { authorId: user.id });

    return build();
  }
}
