import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field()
  id!: number;

  @Field(() => String)
  createdAt: Date = new Date();

  @Field(() => String)
  updatedAt: Date = new Date();

  @Field()
  username!: string;

  password!: string;
}
