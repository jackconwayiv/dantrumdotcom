import { Box, Flex, Heading, Input, Textarea } from "@chakra-ui/react";
import AppButton from "./ui/AppButton";

interface TimelineEventFormProps {
  title: string;
  date: string;
  description: string;
  isEditing: boolean;
  onTitleChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

const TimelineEventForm = ({
  title,
  date,
  description,
  isEditing,
  onTitleChange,
  onDateChange,
  onDescriptionChange,
  onCancel,
  onSave,
}: TimelineEventFormProps) => (
  <Box mt={4} p={3} borderWidth="1px" borderRadius="md" borderColor="oasis.gray">
    <Heading size="sm" mb={2}>
      {isEditing ? "Edit event" : "Add event"}
    </Heading>
    <Flex direction="column" gap={2}>
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
      />
      <Input
        type="date"
        value={date}
        onChange={(e) => onDateChange(e.target.value)}
      />
      <Textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />
      <Flex gap={2}>
        <AppButton size="sm" colorTone="outline" onClick={onCancel}>
          Cancel
        </AppButton>
        <AppButton size="sm" colorTone="success" onClick={onSave}>
          Save
        </AppButton>
      </Flex>
    </Flex>
  </Box>
);

export default TimelineEventForm;
