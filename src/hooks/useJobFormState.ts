
import { useState } from "react";

export const useCorporateFormState = () => {
  const [corporateFormData, setCorporateFormData] = useState({
    company: "",
    position: "",
    location: "",
    salary: "",
    type: "Full Time",
    experience: "",
  });

  const handleCorporateChange = (name: string, value: string) => {
    setCorporateFormData((prev) => ({ ...prev, [name]: value }));
  };

  return { corporateFormData, handleCorporateChange };
};

export const useDomesticFormState = () => {
  const [domesticFormData, setDomesticFormData] = useState({
    work: "",
    dailyWorkTime: "",
    location: "",
    hourlyWage: "",
  });

  const handleDomesticChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDomesticFormData((prev) => ({ ...prev, [name]: value }));
  };

  return { domesticFormData, handleDomesticChange };
};

