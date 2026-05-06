import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getApiUrl } from "./api-url";

// ── Token Manager ─────────────────────────────────────────────────────────────
// Stores the JWT in localStorage so it survives page refreshes and works
// cross-origin (Vercel frontend → Render backend) without cookie issues.
const TOKEN_KEY = "owner_access_token";

export const tokenManager = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

function getAuthHeaders(): Record<string, string> {
  const token = tokenManager.get();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(getApiUrl(url), {
    method,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      ...getAuthHeaders(),   // ← attach JWT on every request
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(getApiUrl(queryKey.join("/") as string), {
      credentials: "include",
      headers: getAuthHeaders(),   // ← attach JWT on every request
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
