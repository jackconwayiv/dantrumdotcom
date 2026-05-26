import { Box, BoxProps } from "@chakra-ui/react";

const AppCard = ({ children, ...props }: BoxProps) => {
  return (
    <Box
      bg="oasis.surface"
      border="1px solid"
      borderColor="oasis.gray"
      borderRadius="card"
      boxShadow="card"
      overflow="hidden"
      {...props}
    >
      {children}
    </Box>
  );
};

export default AppCard;
