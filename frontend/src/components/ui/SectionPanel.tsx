import { Box, BoxProps } from "@chakra-ui/react";

const SectionPanel = ({ children, ...props }: BoxProps) => {
  return (
    <Box
      bg="oasis.surface"
      border="1px solid"
      borderColor="oasis.gray"
      borderRadius="panel"
      p={8}
      boxShadow="panel"
      {...props}
    >
      {children}
    </Box>
  );
};

export default SectionPanel;
