import { HTTPException } from "hono/http-exception";

export function badRequest(message: string, details?: unknown): never {
  throw new HTTPException(400, {
    message,
    cause: details,
  });
}

export function notFound(message: string): never {
  throw new HTTPException(404, { message });
}

export function conflict(message: string, details?: unknown): never {
  throw new HTTPException(409, { message, cause: details });
}

export function unprocessableEntity(message: string, details?: unknown): never {
  throw new HTTPException(422, { message, cause: details });
}

export function jsonError(c: { json: (data: unknown, status: number) => Response }, err: unknown) {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }
  console.error(err);
  return c.json({ error: "Internal server error" }, 500);
}
