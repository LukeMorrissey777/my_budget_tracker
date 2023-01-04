import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { PostgreSqlDriver, SqlEntityManager } from "@mikro-orm/postgresql";
import { Request, Response } from "express";
import { Session, SessionData } from "express-session";

export type MyContext = {
  em: SqlEntityManager<PostgreSqlDriver> &
    EntityManager<IDatabaseDriver<Connection>>;
  req: Request & {
    session: Session & Partial<SessionData> & { userId?: number };
  };
  res: Response;
};
