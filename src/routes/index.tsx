import { Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/dashboard";
import Tasks from "@/pages/tasks";
import NotFound from "@/pages/not-found";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}


