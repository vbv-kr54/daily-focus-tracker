"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { ACTIVITIES, loadDayLog, saveDayLog, type ActivityId } from "@/lib/activities";

export default function LogInPage() {
  const [done, setDone] = useState<Set<ActivityId>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDone(loadDayLog(new Date()));
    setMounted(true);
  }, []);

  function toggle(id: ActivityId) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      saveDayLog(next);
      return next;
    });
  }

  const count = done.size;
  const total = ACTIVITIES.length;
  const percent = Math.round((count / total) * 100);
  const allDone = count === total;

  return (
    <>
      <Header
        title="Log In"
        description="Tap each activity once you've completed it today"
      />

      <div className="flex-1 space-y-8 p-6">
        {/* Daily progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              {mounted ? count : 0} / {total} done today
            </span>
            <span className="text-muted-foreground">{mounted ? percent : 0}%</span>
          </div>
          <Progress value={mounted ? percent : 0} className="h-2" />
          {allDone && mounted && (
            <p className="pt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              All done for today — great work!
            </p>
          )}
        </div>

        {/* Activity tiles — 4 equal columns across full width */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {ACTIVITIES.map((activity) => {
            const isChecked = mounted && done.has(activity.id);
            const Icon = activity.icon;

            return (
              <button
                key={activity.id}
                onClick={() => toggle(activity.id)}
                className={cn(
                  "group relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 py-10 text-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  isChecked
                    ? `border-transparent ${activity.bg} ring-2 ${activity.ring} ring-offset-2 shadow-md`
                    : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
                )}
              >
                {/* Check badge */}
                <span
                  className={cn(
                    "absolute right-3 top-3 transition-opacity",
                    isChecked ? "opacity-100" : "opacity-0"
                  )}
                >
                  <CheckCircle2 className={cn("h-5 w-5", activity.color)} />
                </span>

                {/* Icon circle */}
                <div
                  className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-full transition-all duration-200",
                    isChecked
                      ? `${activity.checked} text-white shadow-lg`
                      : `bg-muted ${activity.color}`
                  )}
                >
                  <Icon className="h-8 w-8" />
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "text-sm font-semibold transition-colors",
                    isChecked
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {activity.label}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground">
          Progress is saved automatically and resets each day at midnight.
        </p>
      </div>
    </>
  );
}
