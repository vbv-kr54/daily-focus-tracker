"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check } from "lucide-react";
import { ACTIVITIES, loadDayLog, type ActivityId } from "@/lib/activities";

type DayLog = Record<string, Set<ActivityId>>;

function toDateString(iso: string): string {
  // iso: "YYYY-MM-DD" → Date.toDateString() for use as key
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toDateString();
}

function daysInRange(startIso: string, endIso: string): Date[] {
  const [sy, sm, sd] = startIso.split("-").map(Number);
  const [ey, em, ed] = endIso.split("-").map(Number);
  const start = new Date(sy, sm - 1, sd);
  const end = new Date(ey, em - 1, ed);
  const days: Date[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function offsetDaysIso(iso: string, offset: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDayLabel(date: Date): { top: string; bottom: string } {
  return {
    top: date.toLocaleDateString("en-US", { weekday: "short" }),
    bottom: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  };
}

function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export default function DashboardPage() {
  const [logs, setLogs] = useState<DayLog>({});
  const [mounted, setMounted] = useState(false);

  const today = todayIso();
  const [startDate, setStartDate] = useState(() => offsetDaysIso(today, -13));
  const [endDate, setEndDate] = useState(today);

  const days = daysInRange(startDate, endDate);

  useEffect(() => {
    const result: DayLog = {};
    for (const day of daysInRange(startDate, endDate)) {
      result[day.toDateString()] = loadDayLog(day);
    }
    setLogs(result);
    setMounted(true);
  }, [startDate, endDate]);

  // Summary counts for today
  const todayLog = logs[new Date().toDateString()] ?? new Set<ActivityId>();
  const doneToday = todayLog.size;

  // Streak: consecutive days (going backwards from today) where all activities were done
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const log = logs[days[i].toDateString()];
    if (log && log.size === ACTIVITIES.length) {
      streak++;
    } else {
      break;
    }
  }

  function handleStartChange(val: string) {
    if (val > endDate) return; // don't allow start after end
    setStartDate(val);
  }

  function handleEndChange(val: string) {
    if (val < startDate) return; // don't allow end before start
    if (val > today) return;     // don't allow future dates
    setEndDate(val);
  }

  return (
    <>
      <Header
        title="Dashboard"
        description="Your activity history at a glance"
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium">Done Today</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {mounted ? doneToday : "—"}
                <span className="text-sm font-normal text-muted-foreground"> / {ACTIVITIES.length}</span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium">Full-Day Streak</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {mounted ? streak : "—"}
                <span className="text-sm font-normal text-muted-foreground"> days</span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium">Tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {days.length}
                <span className="text-sm font-normal text-muted-foreground"> days</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cross-tab grid */}
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">Activity Log</CardTitle>
                <CardDescription>Scroll right to see older entries</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <label className="text-xs text-muted-foreground whitespace-nowrap">From</label>
                  <input
                    type="date"
                    value={startDate}
                    max={endDate}
                    onChange={(e) => handleStartChange(e.target.value)}
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <label className="text-xs text-muted-foreground whitespace-nowrap">To</label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    max={today}
                    onChange={(e) => handleEndChange(e.target.value)}
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-max border-collapse text-sm">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-card py-2 pr-4 text-left font-medium text-muted-foreground">
                    Activity
                  </th>
                  {days.map((day) => {
                    const { top, bottom } = formatDayLabel(day);
                    const today = isToday(day);
                    return (
                      <th
                        key={day.toDateString()}
                        className="min-w-[52px] px-1 py-2 text-center font-normal"
                      >
                        <span
                          className={
                            today
                              ? "flex flex-col items-center rounded-md bg-primary px-1 py-0.5 text-primary-foreground"
                              : "flex flex-col items-center text-muted-foreground"
                          }
                        >
                          <span className="text-[10px] font-semibold uppercase">{top}</span>
                          <span className="text-[10px]">{bottom}</span>
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {ACTIVITIES.map((activity, rowIdx) => {
                  const Icon = activity.icon;
                  return (
                    <tr
                      key={activity.id}
                      className={rowIdx % 2 === 0 ? "bg-muted/30" : ""}
                    >
                      <td className="sticky left-0 z-10 bg-inherit py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted ${activity.color}`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-medium">{activity.label}</span>
                        </div>
                      </td>
                      {days.map((day) => {
                        const log = logs[day.toDateString()];
                        const checked = mounted && log?.has(activity.id);
                        const todayCell = isToday(day);
                        return (
                          <td
                            key={day.toDateString()}
                            className="px-1 py-3 text-center"
                          >
                            {checked ? (
                              <span
                                className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${activity.checked} text-white shadow-sm`}
                              >
                                <Check className="h-3.5 w-3.5 stroke-[3]" />
                              </span>
                            ) : (
                              <span
                                className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${
                                  todayCell ? "bg-muted ring-1 ring-primary/30" : "bg-muted/50"
                                } text-muted-foreground`}
                              >
                                <span className="text-xs">—</span>
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
