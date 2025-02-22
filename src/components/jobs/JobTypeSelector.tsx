
import { Button } from "@/components/ui/button";

interface JobTypeSelectorProps {
  onSelect: (type: "corporate" | "domestic") => void;
}

export const JobTypeSelector = ({ onSelect }: JobTypeSelectorProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold">Post a Job</h1>
      <p className="text-muted-foreground mt-2">
        Which type of job do you want to post?
      </p>
      <div className="mt-8 space-y-4">
        <Button
          className="w-full"
          onClick={() => onSelect("corporate")}
        >
          Corporate Job
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onSelect("domestic")}
        >
          Domestic Job
        </Button>
      </div>
    </div>
  );
};

