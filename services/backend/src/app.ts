import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";

import { createDb } from "./db";
import type { AppEnv } from "./env";
import { customerRoutes } from "./routes/customers";
import { menuRoutes } from "./routes/menu";
import { orderRoutes } from "./routes/orders";
import { settingsRoutes } from "./routes/settings";

export function createApp() {
  const app = new OpenAPIHono<AppEnv>();

  app.use("*", cors());

  app.use("*", async (c, next) => {
    const connectionString = c.env.DATABASE_URL;
    if (!connectionString) {
      throw new HTTPException(500, {
        message: "DATABASE_URL is not configured",
      });
    }
    c.set("db", createDb(connectionString));
    await next();
  });

  app.onError((err, c) => {
    if (err instanceof HTTPException) {
      const body: { error: string; details?: unknown } = { error: err.message };
      if (err.cause !== undefined) {
        body.details = err.cause;
      }
      return c.json(body, err.status);
    }
    console.error(err);
    return c.json({ error: "Internal server error" }, 500);
  });

  app.get("/health", (c) =>
    c.json({ ok: true, service: "ody-backend" }, 200),
  );

  app.route("/", menuRoutes);
  app.route("/", customerRoutes);
  app.route("/", orderRoutes);
  app.route("/", settingsRoutes);

  app.doc("/doc", {
    openapi: "3.1.0",
    info: {
      title: "Ody Restaurant API",
      version: "1.0.0",
      description:
        "Restaurant operations API. Order status changes use POST /orders/{id}/actions only.",
    },
  });

  app.get("/openapi.json", (c) =>
    c.json(
      app.getOpenAPI31Document({
        openapi: "3.1.0",
        info: {
          title: "Ody Restaurant API",
          version: "1.0.0",
        },
      }),
    ),
  );

  return app;
}
