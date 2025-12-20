import { ClipboardList } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-64 text-center p-8"
      data-testid="empty-state"
    >
      <div className="rounded-full bg-muted p-4 mb-4">
        <ClipboardList className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2" data-testid="text-empty-title">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm" data-testid="text-empty-description">
        {description}
      </p>
    </div>
  );
}
