/**
 * Custom fetch mutator for Orval-generated hooks.
 * Safe to edit — this file is not generated.
 */
export function getApiBaseUrl(): string {
  if (typeof process !== "undefined" && process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  return "http://localhost:8787";
}

export type ErrorType<T> = T;

export async function customFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "error" in body &&
      typeof (body as { error: unknown }).error === "string"
        ? (body as { error: string }).error
        : response.statusText;
    throw new Error(message);
  }

  // Orval-generated hooks expect { data, status, headers }, not the raw JSON body.
  return {
    data: body,
    status: response.status,
    headers: response.headers,
  } as T;
}
