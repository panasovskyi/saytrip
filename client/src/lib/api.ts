import { ApiError, isApiErrorBody } from '@/lib/api-error';
import { getApiUrl } from '@/lib/env';

const DEFAULT_TIMEOUT_MS = 10_000;

type HttpMethod = "POST" | "GET";

type QueryValue = string | number | boolean | null | undefined;

export type RequestOptions = Omit<
  RequestInit,
  "method" | "body" | "headers" | "signal"
> & {
  params?: Record<string, QueryValue>;
  headers?: Record<string, string>;
  timeoutMs?: number;
};

const buildUrl = (
  baseUrl: string,
  path: string,
  params?: Record<string, QueryValue>,
): string => {
  const url = new URL(`${baseUrl}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
};

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const baseUrl = getApiUrl();

  const { params, headers, timeoutMs = DEFAULT_TIMEOUT_MS, ...init } = options;

  let res: Response;
  try {
    res = await fetch(buildUrl(baseUrl, path, params), {
      credentials: "include",
      ...init,
      method,
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    console.error(`API request failed: ${method} ${path}`, error);

    if (error instanceof Error && error.name === "TimeoutError") {
      throw new ApiError(504, { message: "The server took too long to respond." });
    }

    throw new ApiError(503, { message: "The server is unreachable." });
  }

  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      res.status,
      isApiErrorBody(data)
        ? data
        : { message: `Request failed (${res.status})` },
    );
  }

  if (res.status === 204) {
    return undefined as T;
  }

  if (data === null) {
    console.error(`API response is not JSON: ${method} ${path}`);
    throw new ApiError(502, {
      message: "The server returned an invalid response.",
    });
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>("GET", path, undefined, options),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, body, options),
};
