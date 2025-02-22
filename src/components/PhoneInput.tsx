
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const countryPhoneCodes = [
  { code: "+1", country: "US" },
  { code: "+1", country: "CA" },
  { code: "+7", country: "RU" },
  { code: "+20", country: "EG" },
  { code: "+27", country: "ZA" },
  { code: "+30", country: "GR" },
  { code: "+31", country: "NL" },
  { code: "+32", country: "BE" },
  { code: "+33", country: "FR" },
  { code: "+34", country: "ES" },
  { code: "+36", country: "HU" },
  { code: "+39", country: "IT" },
  { code: "+40", country: "RO" },
  { code: "+41", country: "CH" },
  { code: "+43", country: "AT" },
  { code: "+44", country: "UK" },
  { code: "+45", country: "DK" },
  { code: "+46", country: "SE" },
  { code: "+47", country: "NO" },
  { code: "+48", country: "PL" },
  { code: "+49", country: "DE" },
  { code: "+51", country: "PE" },
  { code: "+52", country: "MX" },
  { code: "+54", country: "AR" },
  { code: "+55", country: "BR" },
  { code: "+56", country: "CL" },
  { code: "+57", country: "CO" },
  { code: "+58", country: "VE" },
  { code: "+60", country: "MY" },
  { code: "+61", country: "AU" },
  { code: "+62", country: "ID" },
  { code: "+63", country: "PH" },
  { code: "+64", country: "NZ" },
  { code: "+65", country: "SG" },
  { code: "+66", country: "TH" },
  { code: "+81", country: "JP" },
  { code: "+82", country: "KR" },
  { code: "+84", country: "VN" },
  { code: "+86", country: "CN" },
  { code: "+90", country: "TR" },
  { code: "+91", country: "IN" },
  { code: "+92", country: "PK" },
  { code: "+93", country: "AF" },
  { code: "+94", country: "LK" },
  { code: "+95", country: "MM" },
  { code: "+98", country: "IR" },
  { code: "+212", country: "MA" },
  { code: "+213", country: "DZ" },
  { code: "+216", country: "TN" },
  { code: "+218", country: "LY" },
  { code: "+220", country: "GM" },
  { code: "+221", country: "SN" },
  { code: "+233", country: "GH" },
  { code: "+234", country: "NG" },
  { code: "+251", country: "ET" },
  { code: "+254", country: "KE" },
  { code: "+255", country: "TZ" },
  { code: "+256", country: "UG" },
  { code: "+260", country: "ZM" },
  { code: "+263", country: "ZW" },
  { code: "+351", country: "PT" },
  { code: "+352", country: "LU" },
  { code: "+354", country: "IS" },
  { code: "+358", country: "FI" },
  { code: "+380", country: "UA" },
  { code: "+385", country: "HR" },
  { code: "+420", country: "CZ" },
  { code: "+421", country: "SK" },
  { code: "+593", country: "EC" },
  { code: "+852", country: "HK" },
  { code: "+855", country: "KH" },
  { code: "+880", country: "BD" },
  { code: "+886", country: "TW" },
  { code: "+960", country: "MV" },
  { code: "+961", country: "LB" },
  { code: "+962", country: "JO" },
  { code: "+963", country: "SY" },
  { code: "+964", country: "IQ" },
  { code: "+965", country: "KW" },
  { code: "+966", country: "SA" },
  { code: "+971", country: "AE" },
  { code: "+972", country: "IL" },
  { code: "+974", country: "QA" },
  { code: "+977", country: "NP" },
  { code: "+994", country: "AZ" },
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
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="Code" />
        </SelectTrigger>
        <SelectContent>
          {countryPhoneCodes.map(({ code, country }) => (
            <SelectItem key={`${code}-${country}`} value={code}>
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
