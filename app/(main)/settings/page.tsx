"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [focusReminders, setFocusReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  return (
    <>
      <Header title="Settings" description="Manage your preferences and account" />

      <div className="flex-1 space-y-6 p-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Vaibhav Kumar" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="vaibhav@example.com" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" defaultValue="Asia/Kolkata (IST, UTC+5:30)" />
            </div>
            <Button size="sm">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notifications</CardTitle>
            <CardDescription>Control how and when you receive alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Push Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Receive in-app alerts for task reminders
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Focus Reminders</p>
                <p className="text-xs text-muted-foreground">
                  Get nudged when you haven&apos;t started your focus session
                </p>
              </div>
              <Switch
                checked={focusReminders}
                onCheckedChange={setFocusReminders}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Weekly Digest</p>
                <p className="text-xs text-muted-foreground">
                  Receive a weekly productivity summary email
                </p>
              </div>
              <Switch
                checked={weeklyDigest}
                onCheckedChange={setWeeklyDigest}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Appearance</CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Dark Mode</p>
                <p className="text-xs text-muted-foreground">
                  Switch to a dark color scheme
                </p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm font-medium">Accent Color</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Indigo", class: "bg-indigo-500" },
                  { name: "Violet", class: "bg-violet-500" },
                  { name: "Sky", class: "bg-sky-500" },
                  { name: "Emerald", class: "bg-emerald-500" },
                  { name: "Rose", class: "bg-rose-500" },
                ].map((color) => (
                  <button
                    key={color.name}
                    title={color.name}
                    className={`h-7 w-7 rounded-full ${color.class} ring-offset-2 transition-all hover:ring-2 hover:ring-current focus:outline-none`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Currently using Indigo</p>
            </div>
          </CardContent>
        </Card>

        {/* Productivity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Productivity Settings</CardTitle>
            <CardDescription>Tailor the tracker to your work style</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="daily-goal">Daily Task Goal</Label>
                <Input id="daily-goal" type="number" defaultValue="10" min={1} max={50} />
                <p className="text-xs text-muted-foreground">Target number of tasks per day</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="focus-duration">Focus Session (minutes)</Label>
                <Input id="focus-duration" type="number" defaultValue="25" min={5} max={120} />
                <p className="text-xs text-muted-foreground">Default Pomodoro session length</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Pro tip</Badge>
              <p className="text-xs text-muted-foreground">
                25-minute sessions with 5-minute breaks maximise sustained focus.
              </p>
            </div>
            <Button size="sm">Save Preferences</Button>
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions — proceed with caution</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm">
              Export Data
            </Button>
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
