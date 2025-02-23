import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";
import { useState } from "react";

const HOURLY_WAGE_RANGES = [
  "₹0 - ₹200",
  "₹200 - ₹400",
  "₹400 - ₹600",
  "₹600 - ₹800",
  "₹800 - ₹1000",
  "₹1000+"
];

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
  onImageUpload: (file: File) => void;
}

export const DomesticJobForm = ({
  formData,
  onFormChange,
  onSubmit,
  onBack,
  isSubmitting,
  onImageUpload,
}: DomesticJobFormProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      onImageUpload(file);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold">Domestic Job</h1>
      <p className="text-muted-foreground mt-2">
        Post domestic work opportunities
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="work-image" className="block text-sm font-medium mb-2">
              Work Image
            </label>
            <div className="flex items-center gap-4">
              {selectedImage && (
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <label className="cursor-pointer">
                <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Upload className="h-4 w-4" />
                  <span>Upload image</span>
                </div>
                <input
                  type="file"
                  id="work-image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

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
              Hourly Wage Range
            </label>
            <Select
              value={formData.hourlyWage}
              onValueChange={(value) => {
                const event = {
                  target: { name: 'hourlyWage', value }
                } as React.ChangeEvent<HTMLInputElement>;
                onFormChange(event);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select hourly wage range" />
              </SelectTrigger>
              <SelectContent>
                {HOURLY_WAGE_RANGES.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range} per hour
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
