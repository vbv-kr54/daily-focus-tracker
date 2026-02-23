import { Activity, Dumbbell, Code2, Music2, type LucideIcon } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";

export type ActivityId = "jogging" | "pushups" | "vibecode" | "guitar";

export const ACTIVITIES: {
  id: ActivityId;
  label: string;
  icon: LucideIcon;
  color: string;
  ring: string;
  bg: string;
  checked: string;
}[] = [
  { id: "jogging",  label: "Jogging",   icon: Activity, color: "text-orange-500", ring: "ring-green-400", bg: "bg-green-50 dark:bg-green-950/30", checked: "bg-green-500" },
  { id: "pushups",  label: "Pushups",   icon: Dumbbell, color: "text-sky-500",    ring: "ring-green-400", bg: "bg-green-50 dark:bg-green-950/30", checked: "bg-green-500" },
  { id: "vibecode", label: "Vibe Code", icon: Code2,    color: "text-violet-500", ring: "ring-green-400", bg: "bg-green-50 dark:bg-green-950/30", checked: "bg-green-500" },
  { id: "guitar",   label: "Guitar",    icon: Music2,   color: "text-emerald-500",ring: "ring-green-400", bg: "bg-green-50 dark:bg-green-950/30", checked: "bg-green-500" },
];

export function dateKey(date: Date): string {
  return `daily-log-${date.toISOString().slice(0, 10)}`;
}

export function loadDayLog(date: Date): Set<ActivityId> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(dateKey(date));
    return raw ? new Set(JSON.parse(raw) as ActivityId[]) : new Set();
  } catch {
    return new Set();
  }
}

export function saveDayLog(done: Set<ActivityId>, date: Date = new Date()) {
  localStorage.setItem(dateKey(date), JSON.stringify(Array.from(done)));
}

/** Returns the last `n` days as Date objects, oldest first. */
export function lastNDays(n: number): Date[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return d;
  });
}

function isoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function loadDateRangeFromDB(
  startIso: string,
  endIso: string,
  supabase: SupabaseClient
): Promise<Record<string, Set<ActivityId>>> {
  const { data } = await supabase
    .from("daily_logs")
    .select("date, activities")
    .gte("date", startIso)
    .lte("date", endIso);

  const result: Record<string, Set<ActivityId>> = {};
  for (const row of data ?? []) {
    const [y, m, d] = (row.date as string).split("-").map(Number);
    result[new Date(y, m - 1, d).toDateString()] = new Set(
      row.activities as ActivityId[]
    );
  }
  return result;
}

export type DayLogData = {
  done: Set<ActivityId>;
  completedAt: Partial<Record<ActivityId, string>>;
};

export async function loadDayLogFromDB(
  date: Date,
  supabase: SupabaseClient
): Promise<DayLogData> {
  const { data, error } = await supabase
    .from("daily_logs")
    .select("activities, completed_at")
    .eq("date", isoDate(date))
    .maybeSingle();

  if (error || !data) return { done: new Set(), completedAt: {} };
  return {
    done: new Set(data.activities as ActivityId[]),
    completedAt: (data.completed_at ?? {}) as Partial<Record<ActivityId, string>>,
  };
}

export async function saveDayLogToDB(
  logData: DayLogData,
  date: Date,
  supabase: SupabaseClient
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("daily_logs").upsert(
    {
      user_id: user.id,
      date: isoDate(date),
      activities: Array.from(logData.done),
      completed_at: logData.completedAt,
    },
    { onConflict: "user_id,date" }
  );
}
