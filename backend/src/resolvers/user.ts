import {
  Resolver,
  Query,
  Mutation,
  Arg,
  InputType,
  Field,
  Ctx,
  ObjectType,
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

@ObjectType()
class UserOutput {
  @Field({ nullable: true })
  user?: User;
  @Field({ nullable: true })
  error?: string;
}

@Resolver(User)
export class UserResolver {
  @Query(() => UserOutput)
  async me(@Ctx() { req, em }: MyContext): Promise<UserOutput> {
    if (!req.session.userId) {
      return { error: "You are not logged in" };
    }
    const user = await em.findOne(User, req.session.userId);
    return { user };
  }

  @Mutation(() => UserOutput)
  async register(
    @Arg("data") { username, password }: RegisterInput,
    @Ctx() { req, em }: MyContext
  ): Promise<UserOutput> {
    if (username.length <= 3) {
      console.log("error");
      return { error: "Username must be longer than 3 characters", user: null };
    }

    const user = em.create(User, {
      username,
      password,
    });

    await em.persistAndFlush(user);
    req.session.userId = user.id;

    return { user };
  }
}
