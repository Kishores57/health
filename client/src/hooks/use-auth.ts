import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiUrl } from "@/lib/api-url";
import { tokenManager } from "@/lib/queryClient";
import type { User } from "@shared/models/auth";

async function fetchUser(): Promise<User | null> {
  const token = tokenManager.get();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(getApiUrl("/api/auth/user"), {
    credentials: "include",
    headers,
  });

  if (response.status === 401) {
    // Token is invalid or expired — clean up localStorage
    tokenManager.clear();
    return null;
  }

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
}

async function logout(): Promise<void> {
  // Clear localStorage token first
  tokenManager.clear();
  // Then redirect to backend logout (which clears the httpOnly cookie too)
  window.location.href = getApiUrl("/api/logout");
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/user"], null);
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
