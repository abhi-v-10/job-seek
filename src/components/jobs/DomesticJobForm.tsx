
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DomesticJobFormProps {
  formData: {
    work: string;
    dailyWorkTime: string;
    location: string;
    hourlyWage: string;
  };
  onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export const DomesticJobForm = ({
  formData,
  onFormChange,
  onSubmit,
  onBack,
  isSubmitting,
}: DomesticJobFormProps) => {
  return (
    <>
      <h1 className="text-3xl font-bold">Domestic Job</h1>
      <p className="text-muted-foreground mt-2">
        Post domestic work opportunities
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="work" className="block text-sm font-medium mb-2">
              Work
            </label>
            <Input
              id="work"
              name="work"
              value={formData.work}
              onChange={onFormChange}
              placeholder="e.g. Gardening"
              required
            />
          </div>

          <div>
            <label
              htmlFor="dailyWorkTime"
              className="block text-sm font-medium mb-2"
            >
              Daily Work Hours
            </label>
            <Input
              id="dailyWorkTime"
              name="dailyWorkTime"
              type="number"
              min="1"
              max="23"
              value={formData.dailyWorkTime}
              onChange={onFormChange}
              placeholder="e.g. 2"
              required
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-2">
              Location
            </label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={onFormChange}
              required
            />
          </div>

          <div>
            <label
              htmlFor="hourlyWage"
              className="block text-sm font-medium mb-2"
            >
              Hourly Wage
            </label>
            <Input
              id="hourlyWage"
              name="hourlyWage"
              value={formData.hourlyWage}
              onChange={onFormChange}
              placeholder="e.g. 500 - 600 per hour"
              required
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Job"}
          </Button>
        </div>
      </form>
    </>
  );
};
