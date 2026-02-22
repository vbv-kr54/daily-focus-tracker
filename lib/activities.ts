import { Activity, Dumbbell, Code2, Music2, type LucideIcon } from "lucide-react";

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
