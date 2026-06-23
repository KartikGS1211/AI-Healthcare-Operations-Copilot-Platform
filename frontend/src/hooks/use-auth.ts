"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { getInitials, getRoleRedirect } from "@/lib/constants";
import { useAuthStore } from "@/store/auth-store";
import type { RegisterFormValues } from "@/schemas/auth.schema";
import type { UserRole } from "@/types";

export function useAuth() {
  const router = useRouter();
  const { user, token, setAuth, logout: clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (data, variables) => {
      const role = data.role as UserRole;
      const name =
        role === "doctor" ? "Dr. " + variables.email.split("@")[0] : variables.email.split("@")[0];

      setAuth(
        {
          name: name.replace(/\./g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          email: variables.email,
          role,
          initials: getInitials(name),
        },
        data.access_token
      );

      toast.success("Welcome back!");
      router.replace(getRoleRedirect(role));
    },
    onError: () => {
      toast.error("Authentication failed", {
        description: "Invalid email or password.",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterFormValues) => authService.register(payload),
    onSuccess: (_, variables) => {
      toast.success("Account created", {
        description: "Please sign in with your new credentials.",
      });
      router.push("/login?email=" + encodeURIComponent(variables.email));
    },
    onError: (error: { response?: { data?: { detail?: string } } }) => {
      toast.error("Registration failed", {
        description: error.response?.data?.detail ?? "Unable to create account.",
      });
    },
  });

  return {
    user,
    token,
    isAuthenticated: !!user && !!token,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: () => {
      clearAuth();
      router.replace("/login");
    },
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
}
