import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema } from "type-graphql";
import "reflect-metadata";
import { UserResolver } from "./resolvers/user";
import { MikroORM, PostgreSqlDriver } from "@mikro-orm/postgresql";
import config from "./mikro-orm.config";
import { MyContext } from "./types";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import session from "express-session";

const main = async () => {
  const app = express();

  const oneDay = 1000 * 60 * 60 * 24;
  app.use(cookieParser());
  app.set("trust proxy", 1);
  app.use(
    session({
      name: "uid",
      secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
      saveUninitialized: true,
      cookie: { maxAge: oneDay, secure: false },
      resave: false,
    })
  );
  const httpServer = http.createServer(app);
  const orm = await MikroORM.init<PostgreSqlDriver>(config);

  const schema = await buildSchema({
    resolvers: [UserResolver],
    validate: { forbidUnknownValues: false },
  });

  const server = new ApolloServer<MyContext>({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ includeCookies: true }),
    ],
  });
  await server.start();

  const port = parseInt(process.env.PORT) || 8000;

  app.use(
    "/",
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({
        em: orm.em.fork(),
        req,
        res,
      }),
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000/`);
};

main();
