"use client";

import { Bell, Moon, Shield, User } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function DoctorSettingsPage() {
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((s) => s.user);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account, notifications, and platform preferences.
        </p>
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Profile</CardTitle>
          </div>
          <CardDescription>Update your professional information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={user?.name ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue={user?.email ?? ""} />
            </div>
          </div>
          <Button onClick={() => toast.success("Profile updated successfully.")}>
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Drug interaction alerts", defaultChecked: true },
            { label: "Report analysis complete", defaultChecked: true },
            { label: "Weekly analytics digest", defaultChecked: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <Label htmlFor={item.label}>{item.label}</Label>
              <Switch id={item.label} defaultChecked={item.defaultChecked} />
            </div>
          ))}
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
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">
                Toggle between light and dark themes
              </p>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Security & Compliance</CardTitle>
          </div>
          <CardDescription>HIPAA-compliant data handling settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Two-factor authentication</Label>
            <Switch defaultChecked />
          </div>
          <Separator />
          <Button variant="outline">View Audit Logs</Button>
        </CardContent>
      </Card>
    </div>
  );
}
