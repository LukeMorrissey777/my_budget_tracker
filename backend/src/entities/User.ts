import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt: Date = new Date();

  @Property({ type: "date" })
  @Field(() => String)
  updatedAt: Date = new Date();

  @Property({ unique: true })
  @Field()
  username!: string;

  @Property()
  password!: string;
}
