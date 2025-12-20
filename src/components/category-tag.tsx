import { Badge } from "@/components/ui/badge";
import { type TaskCategory } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Briefcase, User, ShoppingCart, Heart, DollarSign, MoreHorizontal } from "lucide-react";

interface CategoryTagProps {
  category: TaskCategory;
  className?: string;
}

const categoryConfig: Record<TaskCategory, { label: string; icon: typeof Briefcase }> = {
  "work": { label: "Work", icon: Briefcase },
  "personal": { label: "Personal", icon: User },
  "shopping": { label: "Shopping", icon: ShoppingCart },
  "health": { label: "Health", icon: Heart },
  "finance": { label: "Finance", icon: DollarSign },
  "other": { label: "Other", icon: MoreHorizontal },
};

export function CategoryTag({ category, className }: CategoryTagProps) {
  const config = categoryConfig[category];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn("inline-flex items-center gap-1.5 text-xs font-medium", className)}
      data-testid={`tag-category-${category}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
