import { Box, Select, Spinner, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface YearSelectorProps {
  selectedYear: string | number;
  setSelectedYear: React.Dispatch<React.SetStateAction<string | number>>;
}

const YearSelector = ({ selectedYear, setSelectedYear }: YearSelectorProps) => {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchYears = async () => {
      const response = await axios.get("/api/years/");
      if (response) {
        setYears(response.data);
        setLoading(false);
      } else {
        console.error(`Couldn't retrieve album years: ${error}`);
        setError(error);
        setLoading(false);
      }
    };
    fetchYears();
  }, []);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "mine") {
      setSelectedYear("mine");
    } else {
      setSelectedYear(value);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Text>Error: {JSON.stringify(error)}</Text>;
  }

  return (
    <Box>
      <Select defaultValue={selectedYear} onChange={(e) => handleYearChange(e)}>
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
