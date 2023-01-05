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
import bcrypt from "bcrypt";

@InputType()
class UsernamePasswordInput {
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
    @Arg("data") { username, password }: UsernamePasswordInput,
    @Ctx() { req, em }: MyContext
  ): Promise<UserOutput> {
    if (username.length <= 3) {
      return { error: "Username must be longer than 3 characters" };
    }

    if (password.length <= 5) {
      return { error: "Password must be longer than 5 characters" };
    }

    const user = em.create(User, {
      username,
      password: await bcrypt.hash(password, 10),
    });

    try {
      await em.persistAndFlush(user);
    } catch (error) {
      if (error.code === "23505") {
        return { error: "A user with that username already exsists" };
      }
      // console.error(error);
    }

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserOutput)
  async login(
    @Arg("data") { username, password }: UsernamePasswordInput,
    @Ctx() { req, em }: MyContext
  ): Promise<UserOutput> {
    const user = await em.findOne(User, { username });

    if (!user) {
      return { error: "No user with that username exsists" };
    }

    if (await bcrypt.compare(password, user.password)) {
      req.session.userId = user.id;
      return { user };
    }

    return { error: "Incorrect password" };
  }
}
