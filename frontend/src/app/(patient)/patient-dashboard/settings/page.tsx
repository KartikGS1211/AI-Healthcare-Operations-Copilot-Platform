"use client";

import { Moon, User } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function PatientSettingsPage() {
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((s) => s.user);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your profile and preferences.</p>
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Profile</CardTitle>
          </div>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input defaultValue={user?.name ?? ""} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue={user?.email ?? ""} />
            </div>
          </div>
          <Button onClick={() => toast.success("Profile updated")}>Save Changes</Button>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Appearance</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="font-medium">Dark Mode</p>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
