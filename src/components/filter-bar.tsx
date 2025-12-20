import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TASK_STATUSES, TASK_CATEGORIES, type TaskStatus, type TaskCategory } from "@shared/schema";
import { X, Filter } from "lucide-react";

interface FilterBarProps {
  statusFilter: TaskStatus | "all";
  categoryFilter: TaskCategory | "all";
  onStatusChange: (status: TaskStatus | "all") => void;
  onCategoryChange: (category: TaskCategory | "all") => void;
  onClearFilters: () => void;
}

export function FilterBar({
  statusFilter,
  categoryFilter,
  onStatusChange,
  onCategoryChange,
  onClearFilters,
}: FilterBarProps) {
  const hasFilters = statusFilter !== "all" || categoryFilter !== "all";

  return (
    <div className="sticky top-16 z-40 backdrop-blur-sm border-b py-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Filters:</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 flex-1">
          <Select
            value={statusFilter}
            onValueChange={(value) => onStatusChange(value as TaskStatus | "all")}
          >
            <SelectTrigger className="w-40 border-[#D38EEC] dark:border-[#9D43AD]" data-testid="filter-status">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" data-testid="filter-status-all">
                All Statuses
              </SelectItem>
              {TASK_STATUSES.map((status) => (
                <SelectItem
                  key={status.value}
                  value={status.value}
                  data-testid={`filter-status-${status.value}`}
                >
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={categoryFilter}
            onValueChange={(value) => onCategoryChange(value as TaskCategory | "all")}
          >
            <SelectTrigger className="w-40 border-[#D38EEC] dark:border-[#9D43AD]" data-testid="filter-category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" data-testid="filter-category-all">
                All Categories
              </SelectItem>
              {TASK_CATEGORIES.map((category) => (
                <SelectItem
                  key={category.value}
                  value={category.value}
                  data-testid={`filter-category-${category.value}`}
                >
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-muted-foreground"
              data-testid="button-clear-filters"
            >
              <X className="mr-1 h-4 w-4" />
              Clear filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
