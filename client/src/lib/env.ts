export function getApiUrl(): string {
  const value = process.env.NEXT_PUBLIC_API_URL;

  if (!value) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is missing in environment variables, e.g. http://localhost:5000/api",
    );
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`NEXT_PUBLIC_API_URL is not a valid URL: ${value}`);
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`NEXT_PUBLIC_API_URL must start with http:// or https://, got: ${value}`);
  }

  return url.toString().replace(/\/+$/, "");
}
