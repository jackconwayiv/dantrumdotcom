import { Button, ButtonProps } from "@chakra-ui/react";
import { ButtonTone, getButtonToneProps } from "../../theme/buttonTone";

export type { ButtonTone };

export interface AppButtonProps extends ButtonProps {
  colorTone?: ButtonTone;
}

const AppButton = ({ colorTone = "primary", ...props }: AppButtonProps) => {
  return <Button {...getButtonToneProps(colorTone)} {...props} />;
};

export default AppButton;
