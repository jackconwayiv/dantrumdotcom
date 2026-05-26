import { Box, Select } from "@chakra-ui/react";
import React from "react";

interface YearSelectorProps {
  years: number[];
  selectedYear: string | number;
  setSelectedYear: (year: string | number) => void;
}

const YearSelector = ({
  years,
  selectedYear,
  setSelectedYear,
}: YearSelectorProps) => {
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "mine") {
      setSelectedYear("mine");
    } else {
      setSelectedYear(Number(value));
    }
  };

  return (
    <Box>
      <Select value={String(selectedYear)} onChange={handleYearChange}>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
        <option value="mine">My Albums</option>
      </Select>
    </Box>
  );
};

export default YearSelector;
