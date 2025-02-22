
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const countryPhoneCodes = [
  { code: "+1", country: "US/CA" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "IN" },
  { code: "+81", country: "JP" },
  { code: "+86", country: "CN" },
  { code: "+61", country: "AU" },
  { code: "+33", country: "FR" },
  { code: "+49", country: "DE" },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function PhoneInput({ value, onChange, className }: PhoneInputProps) {
  const currentCode = countryPhoneCodes.find(({ code }) => value?.startsWith(code))?.code || "+1";
  const number = value?.replace(currentCode, "") || "";

  const handleCodeChange = (code: string) => {
    onChange(code + number);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(currentCode + e.target.value);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Select value={currentCode} onValueChange={handleCodeChange}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Code" />
        </SelectTrigger>
        <SelectContent>
          {countryPhoneCodes.map(({ code, country }) => (
            <SelectItem key={code} value={code}>
              {code} {country}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        value={number}
        onChange={handleNumberChange}
        placeholder="Phone number"
        className="flex-1"
      />
    </div>
  );
}
