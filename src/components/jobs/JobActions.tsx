
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface JobActionsProps {
  onViewDetails: () => void;
}

export function JobActions({ onViewDetails }: JobActionsProps) {
  return (
    <div className="flex gap-2">
      <Button 
        variant="secondary" 
        size="sm"
        onClick={onViewDetails}
      >
        <Eye className="mr-2 h-4 w-4" />
        Details
      </Button>
    </div>
  );
}

