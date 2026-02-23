"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import {
  ACTIVITIES,
  loadDayLogFromDB,
  saveDayLogToDB,
  type ActivityId,
  type DayLogData,
} from "@/lib/activities";
import { createClient } from "@/lib/supabase/client";

const LAUNCH_DATE = "2026-02-22";

function localIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function dateFromIso(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function TodayPage() {
  const todayIso = localIso(new Date());
  const [selectedIso, setSelectedIso] = useState(todayIso);
  const [logData, setLogData] = useState<DayLogData>({ done: new Set(), completedAt: {} });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(false);
    const supabase = createClient();
    loadDayLogFromDB(dateFromIso(selectedIso), supabase).then((data) => {
      setLogData(data);
      setMounted(true);
    });
  }, [selectedIso]);

  async function toggle(id: ActivityId) {
    const nextDone = new Set(logData.done);
    const nextCompletedAt = { ...logData.completedAt };

    if (nextDone.has(id)) {
      nextDone.delete(id);
      delete nextCompletedAt[id];
    } else {
      nextDone.add(id);
      nextCompletedAt[id] = new Date().toISOString();
    }

    const next: DayLogData = { done: nextDone, completedAt: nextCompletedAt };
    setLogData(next);
    const supabase = createClient();
    await saveDayLogToDB(next, dateFromIso(selectedIso), supabase);
  }

  const { done, completedAt } = logData;
  const isToday = selectedIso === todayIso;
  const count = done.size;
  const total = ACTIVITIES.length;
  const percent = Math.round((count / total) * 100);
  const allDone = count === total;

  return (
    <>
      <Header
        title="Today"
        description="Tap each activity once you've completed it today"
      />

      <div className="flex-1 space-y-8 p-6">
        {/* Daily progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              {mounted ? count : 0} / {total} done {isToday ? "today" : "that day"}
            </span>
            <span className="text-muted-foreground">{mounted ? percent : 0}%</span>
          </div>
          <Progress value={mounted ? percent : 0} className="h-2" />
          {allDone && mounted && (
            <p className="pt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              All done {isToday ? "for today" : "for that day"} — great work!
            </p>
          )}
        </div>

        {/* Activity tiles */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {ACTIVITIES.map((activity) => {
            const isChecked = mounted && done.has(activity.id);
            const timestamp = mounted && isChecked ? completedAt[activity.id] : undefined;
            const Icon = activity.icon;

            return (
              <button
                key={activity.id}
                onClick={() => toggle(activity.id)}
                className={cn(
                  "group relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 py-10 text-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
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

                {/* Completion timestamp */}
                <span
                  className={cn(
                    "text-xs transition-all duration-200",
                    timestamp
                      ? "text-muted-foreground"
                      : "invisible"
                  )}
                >
                  {timestamp ? `Done at ${formatTime(timestamp)}` : "placeholder"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Progress is saved automatically and resets each day at midnight.
          </p>
          <div className="flex items-center gap-2">
            {!isToday && (
              <button
                onClick={() => setSelectedIso(todayIso)}
                className="text-xs text-primary hover:underline"
              >
                Back to today
              </button>
            )}
            <input
              type="date"
              value={selectedIso}
              min={LAUNCH_DATE}
              max={todayIso}
              onChange={(e) => setSelectedIso(e.target.value)}
              className="h-7 rounded-md border border-input bg-background px-2 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>
      </div>
    </>
  );
}
