const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

async function handle<T>(res: Response): Promise<T> {
  if (res.ok) return res.json() as Promise<T>;
  let msg = "Request failed";
  try {
    const body = await res.json();
    msg = body?.message ?? msg;
  } catch {}
  throw new Error(msg);
}

export const apiClient = {
  get: async <T>(path: string) => handle<T>(await fetch(`${API_URL}${path}`)),
  post: async <T>(path: string, body: unknown) =>
    handle<T>(
      await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
    ),
  patch: async <T>(path: string, body: unknown) =>
    handle<T>(
      await fetch(`${API_URL}${path}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
    ),
  del: async (path: string) =>
    handle<unknown>(await fetch(`${API_URL}${path}`, { method: "DELETE" })),
};
