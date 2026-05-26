import { Box, Tooltip } from "@chakra-ui/react";
import {
  timelineActiveMonth,
  timelineActiveMonthHover,
  timelineEmptyMonth,
} from "../theme/semantic";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

interface MonthCellProps {
  month: number;
  hasEvents: boolean;
  onClick: () => void;
}

const MonthCell = ({ month, hasEvents, onClick }: MonthCellProps) => {
  return (
    <Tooltip label={MONTH_LABELS[month - 1]} fontSize="sm">
      <Box
        as="button"
        type="button"
        aria-label={MONTH_LABELS[month - 1]}
        width="100%"
        minW="20px"
        height="20px"
        borderRadius="sm"
        bg={hasEvents ? timelineActiveMonth : timelineEmptyMonth}
        border="1px solid"
        borderColor={hasEvents ? "oasis.green.600" : "oasis.gray"}
        cursor={hasEvents ? "pointer" : "default"}
        _hover={hasEvents ? { bg: timelineActiveMonthHover } : undefined}
        onClick={hasEvents ? onClick : undefined}
      />
    </Tooltip>
  );
};

export default MonthCell;
