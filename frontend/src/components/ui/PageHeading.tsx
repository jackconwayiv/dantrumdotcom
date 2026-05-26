import { Heading, HeadingProps } from "@chakra-ui/react";

const PageHeading = ({ children, size = "lg", ...props }: HeadingProps) => {
  return (
    <Heading size={size} mb={4} {...props}>
      {children}
    </Heading>
  );
};

export default PageHeading;
