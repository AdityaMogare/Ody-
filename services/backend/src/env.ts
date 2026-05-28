export type AppEnv = {
  Bindings: {
    DATABASE_URL: string;
  };
  Variables: {
    db: import("./db").Database;
  };
};
