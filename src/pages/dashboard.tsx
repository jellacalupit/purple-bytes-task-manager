import { useState, useMemo, useEffect } from "react";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { localStorageService } from "@/lib/localStorage";
import { type Task } from "@shared/schema";
import { format } from "date-fns";

interface RecentActivity {
  id: string;
  taskId: string;
  taskTitle: string;
  action: "created" | "updated";
  timestamp: number;
}

export default function Dashboard() {
  const { toast } = useToast();
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from localStorage
  useEffect(() => {
    const loadedTasks = localStorageService.getTasks();
    setTasks(loadedTasks);
  }, []);

  // Load recent activity from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("taskRecentActivity");
    if (stored) {
      try {
        setRecentActivity(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse recent activity:", e);
      }
    }
  }, []);

  // Track task changes and update recent activity
  useEffect(() => {
    const activity: RecentActivity[] = [];
    
    tasks.forEach((task) => {
      if (task.createdAt) {
        activity.push({
          id: `${task.id}-${task.createdAt}`,
          taskId: task.id,
          taskTitle: task.title,
          action: "created",
          timestamp: new Date(task.createdAt).getTime(),
        });
      }
    });

    // Sort by timestamp descending and keep only top 10
    activity.sort((a, b) => b.timestamp - a.timestamp);
    const topActivity = activity.slice(0, 10);

    setRecentActivity(topActivity);
    localStorage.setItem("taskRecentActivity", JSON.stringify(topActivity));
  }, [tasks]);

  const taskCounts = useMemo(() => {
    const todo = tasks.filter((t) => t.status === "todo").length;
    const inProgress = tasks.filter((t) => t.status === "in-progress").length;
    const done = tasks.filter((t) => t.status === "done").length;
    return { todo, inProgress, done, total: tasks.length };
  }, [tasks]);

  return (
    <LayoutWrapper>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6">
        <h2 className="text-2xl font-semibold tracking-tight mb-8" data-testid="text-page-title">
          Dashboard
        </h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-[#D38EEC] dark:border-[#9D43AD]">
            <div className="flex flex-col items-center justify-center">
              <p className="text-muted-foreground text-sm mb-2">To-Do</p>
              <p className="text-4xl font-bold text-[#D38EEC]">{taskCounts.todo}</p>
            </div>
          </Card>
          <Card className="p-6 border-[#D38EEC] dark:border-[#9D43AD]">
            <div className="flex flex-col items-center justify-center">
              <p className="text-muted-foreground text-sm mb-2">In Progress</p>
              <p className="text-4xl font-bold text-[#D38EEC]">{taskCounts.inProgress}</p>
            </div>
          </Card>
          <Card className="p-6 border-[#D38EEC] dark:border-[#9D43AD]">
            <div className="flex flex-col items-center justify-center">
              <p className="text-muted-foreground text-sm mb-2">Done</p>
              <p className="text-4xl font-bold text-[#D38EEC]">{taskCounts.done}</p>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-xl font-semibold tracking-tight mb-4">Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No recent activity yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 overflow-x-auto">
              {recentActivity.map((activity) => (
                <Card key={activity.id} className="p-4 border-[#D38EEC] dark:border-[#9D43AD]">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.taskTitle}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Created • {format(new Date(activity.timestamp), "MMM d, yyyy h:mm a")}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      Created
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </LayoutWrapper>
  );
}
