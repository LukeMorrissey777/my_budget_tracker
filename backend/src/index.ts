import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";
import "reflect-metadata";
import { UserResolver } from "./resolvers/user";
import { MikroORM, PostgreSqlDriver } from "@mikro-orm/postgresql";
import config from "./mikro-orm.config";
import { User } from "./entities/User";
import { MyContext } from "./types";

const main = async () => {
  const orm = await MikroORM.init<PostgreSqlDriver>(config);

  const schema = await buildSchema({
    resolvers: [UserResolver],
    validate: { forbidUnknownValues: false },
  });

  const server = new ApolloServer<MyContext>({
    schema,
  });
  const port = parseInt(process.env.PORT) || 8000;

  const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: async () => ({
      em: orm.em.fork(),
    }),
  });

  console.log(`🚀  Server ready at: ${url}`);
};

main();
