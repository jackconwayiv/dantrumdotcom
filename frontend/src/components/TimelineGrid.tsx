import { Box, Flex, Text } from "@chakra-ui/react";
import { TimelineYearSummary } from "../helpers/types";
import MonthCell from "./MonthCell";

interface TimelineGridProps {
  years: TimelineYearSummary[];
  onMonthClick: (year: number, month: number) => void;
}

const TimelineGrid = ({ years, onMonthClick }: TimelineGridProps) => {
  return (
    <Flex direction="column" gap={2} width="100%">
      {years.map(({ year, months_with_events }) => {
        const activeMonths = new Set(months_with_events);
        return (
          <Flex key={year} alignItems="center" gap={2} width="100%">
            <Text fontWeight="bold" fontSize="sm" minW="48px" color="brand.600">
              {year}
            </Text>
            <Box flex="1" overflowX="auto">
              <Flex
                gap={1}
                minW="240px"
                display="grid"
                gridTemplateColumns="repeat(12, minmax(20px, 1fr))"
              >
                {Array.from({ length: 12 }, (_, index) => {
                  const month = index + 1;
                  return (
                    <MonthCell
                      key={month}
                      month={month}
                      hasEvents={activeMonths.has(month)}
                      onClick={() => onMonthClick(year, month)}
                    />
                  );
                })}
              </Flex>
            </Box>
          </Flex>
        );
      })}
    </Flex>
  );
};

export default TimelineGrid;
