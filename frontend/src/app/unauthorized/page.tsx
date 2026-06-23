"use client";

import Link from "next/link";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="max-w-md border-border/50 bg-card/80 shadow-xl backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <ShieldX className="h-7 w-7 text-destructive" />
          </div>
          <CardTitle>Unauthorized Access</CardTitle>
          <CardDescription>
            You don&apos;t have permission to view this page. Please sign in with
            the correct role.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button render={<Link href="/login" />}>Back to Login</Button>
          <Button variant="outline" render={<Link href="/" />}>
            Go Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
