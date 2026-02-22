"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Circle, Clock, CheckCircle2 } from "lucide-react";
import type { Task } from "@/types";

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Review Q1 goals",
    description: "Go through the Q1 OKRs and evaluate progress",
    priority: "high",
    status: "done",
    dueDate: "2026-02-22",
    createdAt: "2026-02-20",
    tags: ["planning", "review"],
  },
  {
    id: "2",
    title: "Update project roadmap",
    description: "Revise the roadmap based on new customer feedback",
    priority: "medium",
    status: "in_progress",
    dueDate: "2026-02-24",
    createdAt: "2026-02-21",
    tags: ["product"],
  },
  {
    id: "3",
    title: "Team sync meeting",
    description: "Weekly standup with the engineering team",
    priority: "high",
    status: "todo",
    dueDate: "2026-02-22",
    createdAt: "2026-02-22",
    tags: ["meeting"],
  },
  {
    id: "4",
    title: "Write weekly report",
    description: "Summarize this week's accomplishments and blockers",
    priority: "low",
    status: "todo",
    dueDate: "2026-02-28",
    createdAt: "2026-02-22",
    tags: ["reporting"],
  },
  {
    id: "5",
    title: "Fix onboarding bug",
    description: "Users are hitting a 500 error on step 3 of onboarding",
    priority: "high",
    status: "done",
    dueDate: "2026-02-21",
    createdAt: "2026-02-20",
    tags: ["bug", "engineering"],
  },
  {
    id: "6",
    title: "Design system audit",
    description: "Identify inconsistencies in the component library",
    priority: "medium",
    status: "todo",
    dueDate: "2026-03-01",
    createdAt: "2026-02-22",
    tags: ["design"],
  },
];

const priorityVariant: Record<string, "default" | "warning" | "destructive" | "secondary"> = {
  high: "destructive",
  medium: "warning",
  low: "secondary",
};

const statusIcon: Record<string, React.ElementType> = {
  done: CheckCircle2,
  in_progress: Clock,
  todo: Circle,
};

function TaskCard({ task }: { task: Task }) {
  const Icon = statusIcon[task.status];
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card p-4 transition-shadow hover:shadow-sm">
      <Checkbox
        id={`task-${task.id}`}
        checked={task.status === "done"}
        className="mt-0.5"
      />
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <label
            htmlFor={`task-${task.id}`}
            className={`text-sm font-medium cursor-pointer ${
              task.status === "done" ? "line-through text-muted-foreground" : ""
            }`}
          >
            {task.title}
          </label>
          <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
          {task.tags?.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        {task.description && (
          <p className="text-xs text-muted-foreground">{task.description}</p>
        )}
        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Icon className="h-3 w-3" />
            <span>Due {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TasksPage() {
  const [tasks] = useState<Task[]>(initialTasks);

  const todo = tasks.filter((t) => t.status === "todo");
  const inProgress = tasks.filter((t) => t.status === "in_progress");
  const done = tasks.filter((t) => t.status === "done");

  return (
    <>
      <Header title="Tasks" description="Manage and track your daily tasks" />

      <div className="flex-1 space-y-6 p-6">
        {/* Summary row */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Circle className="h-4 w-4" /> To Do
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{todo.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" /> In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{inProgress.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> Done
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{done.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Task list with tabs */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">All Tasks</h2>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
            <TabsTrigger value="todo">To Do ({todo.length})</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress ({inProgress.length})</TabsTrigger>
            <TabsTrigger value="done">Done ({done.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4 space-y-2">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </TabsContent>

          <TabsContent value="todo" className="mt-4 space-y-2">
            {todo.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No pending tasks. Great job!
              </p>
            ) : (
              todo.map((task) => <TaskCard key={task.id} task={task} />)
            )}
          </TabsContent>

          <TabsContent value="in_progress" className="mt-4 space-y-2">
            {inProgress.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nothing in progress right now.
              </p>
            ) : (
              inProgress.map((task) => <TaskCard key={task.id} task={task} />)
            )}
          </TabsContent>

          <TabsContent value="done" className="mt-4 space-y-2">
            {done.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No completed tasks yet.
              </p>
            ) : (
              done.map((task) => <TaskCard key={task.id} task={task} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
