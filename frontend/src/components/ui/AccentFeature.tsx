import { Flex, FlexProps } from "@chakra-ui/react";

export type AccentColor = "purple" | "green" | "orange";

const accentBorderColors: Record<AccentColor, string> = {
  purple: "brand.600",
  green: "oasis.green.600",
  orange: "oasis.orange.600",
};

interface AccentFeatureProps extends FlexProps {
  accent?: AccentColor;
}

const AccentFeature = ({
  accent = "purple",
  children,
  ...props
}: AccentFeatureProps) => {
  return (
    <Flex
      alignItems="center"
      width="90%"
      m={2}
      p={3}
      bg="oasis.surface"
      border="1px solid"
      borderColor="oasis.gray"
      borderLeft="8px solid"
      borderLeftColor={accentBorderColors[accent]}
      borderRadius="18px"
      cursor="pointer"
      transition="background 0.15s ease"
      _hover={{ bg: "brand.50" }}
      {...props}
    >
      {children}
    </Flex>
  );
};

export default AccentFeature;
