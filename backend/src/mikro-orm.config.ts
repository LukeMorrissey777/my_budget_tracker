import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";

const config: Options<PostgreSqlDriver> = {
  entities: ["./dist/entities"],
  entitiesTs: ["./src/entities"],
  dbName: "budgetdb",
  type: "postgresql",
  user: "lukez",
};

export default config;
