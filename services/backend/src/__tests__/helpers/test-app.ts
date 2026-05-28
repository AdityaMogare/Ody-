import { createApp } from "../../app";
import { getTestDatabaseUrl } from "./test-env";

const app = createApp();

export async function testRequest(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  return app.request(path, init, { DATABASE_URL: getTestDatabaseUrl() });
}

export async function testJson<T>(res: Response): Promise<T> {
  return res.json() as Promise<T>;
}
