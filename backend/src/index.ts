import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
};

const main = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  const port = parseInt(process.env.PORT) || 8000;

  const { url } = await startStandaloneServer(server, {
    listen: { port },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

main();
