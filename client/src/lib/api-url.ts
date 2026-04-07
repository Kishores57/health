export function getApiUrl(path: string): string {
  const baseUrl = import.meta.env.VITE_API_URL || "";
  // Ensure we don't have double slashes if path starts with / and baseUrl ends with /
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}
