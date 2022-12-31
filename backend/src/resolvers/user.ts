import {
  Resolver,
  Query,
  Mutation,
  Arg,
  InputType,
  Field,
  Ctx,
} from "type-graphql";
import { User } from "../entities/User";
import { MyContext } from "../types";

@InputType()
class RegisterInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@Resolver(User)
export class UserResolver {
  private userCollection: User[] = [];

  @Query((returns) => [User])
  async users() {
    return await this.userCollection;
  }

  @Mutation(() => User)
  async register(
    @Arg("data") newUserData: RegisterInput,
    @Ctx() { em }: MyContext
  ): Promise<User> {
    const user = em.create(User, {
      username: newUserData.username,
      password: newUserData.password,
    });
    await em.persistAndFlush(user);

    this.userCollection.push(user);
    return user;
  }
}
