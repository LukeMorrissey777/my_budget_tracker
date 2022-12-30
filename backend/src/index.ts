import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";
import "reflect-metadata";
import { UserResolver } from "./resolvers/user";

const main = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver],
    validate: { forbidUnknownValues: false },
  });

  const server = new ApolloServer({
    schema,
  });
  const port = parseInt(process.env.PORT) || 8000;

  const { url } = await startStandaloneServer(server, {
    listen: { port },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

main();
