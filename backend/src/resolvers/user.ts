import { Resolver, Query, Mutation, Arg, InputType, Field } from "type-graphql";
import { User } from "../entities/User";

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

  @Mutation()
  register(@Arg("data") newUserData: RegisterInput): User {
    const user: User = {
      id: Math.floor(Math.random() * 10000),
      username: newUserData.username,
      password: newUserData.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.userCollection.push(user);
    return user;
  }
}
