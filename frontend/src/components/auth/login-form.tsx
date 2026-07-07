"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Stethoscope, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const { login, isLoggingIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    await login(values);
  }

  async function handleDemoLogin(email: string) {
    setValue("email", email);
    setValue("password", "Password123");
    await login({ email, password: "Password123" });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@hospital.org"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            autoComplete="current-password"
            className="pr-10"
            {...register("password")}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none z-10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowPassword((v) => !v);
            }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoggingIn}>
        {isLoggingIn ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-border/50"></div>
        <span className="flex-shrink mx-4 text-xs text-muted-foreground uppercase">Or Quick Access Demo</span>
        <div className="flex-grow border-t border-border/50"></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleDemoLogin("doctor@hospital.org")}
          disabled={isLoggingIn}
          className="w-full flex items-center justify-center gap-2 hover:bg-primary/5 hover:text-primary transition-all duration-300"
        >
          <Stethoscope className="h-4 w-4 text-primary" />
          Doctor Demo
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleDemoLogin("patient@hospital.org")}
          disabled={isLoggingIn}
          className="w-full flex items-center justify-center gap-2 hover:bg-indigo-500/5 hover:text-indigo-500 transition-all duration-300"
        >
          <User className="h-4 w-4 text-indigo-500" />
          Patient Demo
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Register
        </Link>
      </p>
    </form>
  );
}
