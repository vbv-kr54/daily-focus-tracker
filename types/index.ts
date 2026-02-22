export type Priority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate?: string;
  createdAt: string;
  tags?: string[];
}

export interface DailyStat {
  label: string;
  value: number;
  total: number;
  unit?: string;
}
