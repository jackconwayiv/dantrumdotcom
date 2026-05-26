import { ButtonProps } from "@chakra-ui/react";

export type ButtonTone =
  | "primary"
  | "success"
  | "cta"
  | "soft"
  | "outline";

const toneStyles: Record<
  ButtonTone,
  Pick<ButtonProps, "bg" | "color" | "border" | "borderColor" | "_hover">
> = {
  primary: {
    bg: "brand.500",
    color: "white",
    _hover: { bg: "brand.600" },
  },
  success: {
    bg: "oasis.green.500",
    color: "white",
    _hover: { bg: "oasis.green.600" },
  },
  cta: {
    bg: "oasis.orange.500",
    color: "white",
    _hover: { bg: "oasis.orange.600" },
  },
  soft: {
    bg: "brand.100",
    color: "brand.600",
    _hover: { bg: "brand.200" },
  },
  outline: {
    bg: "transparent",
    color: "oasis.text",
    border: "1px solid",
    borderColor: "oasis.gray",
    _hover: { bg: "gray.50" },
  },
};

export const getButtonToneProps = (
  tone: ButtonTone = "primary"
): ButtonProps => ({
  borderRadius: "full",
  variant: "solid",
  ...toneStyles[tone],
});
