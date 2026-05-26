import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { RefObject } from "react";

interface TimelineConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  leastDestructiveRef: RefObject<HTMLButtonElement>;
  title: string;
  body: string;
  confirmLabel: string;
  confirmColorScheme?: string;
  onConfirm: () => void;
}

const TimelineConfirmDialog = ({
  isOpen,
  onClose,
  leastDestructiveRef,
  title,
  body,
  confirmLabel,
  confirmColorScheme = "red",
  onConfirm,
}: TimelineConfirmDialogProps) => (
  <AlertDialog
    isOpen={isOpen}
    leastDestructiveRef={leastDestructiveRef}
    onClose={onClose}
  >
    <AlertDialogOverlay>
      <AlertDialogContent>
        <AlertDialogHeader>{title}</AlertDialogHeader>
        <AlertDialogBody>{body}</AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={leastDestructiveRef} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme={confirmColorScheme} onClick={onConfirm} ml={3}>
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogOverlay>
  </AlertDialog>
);

export default TimelineConfirmDialog;
