import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

interface ProfileModalsProps {
  formik: any;
  isOpen: any;
  onClose: any;
}

const ProfileModals = ({ formik, isOpen, onClose }: ProfileModalsProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontFamily="Comic Sans MS">Edit Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={formik.handleSubmit}>
            <Flex direction="column" m={3}>
              <label htmlFor="first_name">First Name:</label>
              <Input
                type="text"
                name="first_name"
                value={formik.values.first_name}
                onChange={formik.handleChange}
              />
            </Flex>
            <Flex direction="column" m={3}>
              <label htmlFor="last_name">Last Name:</label>
              <Input
                type="text"
                name="last_name"
                value={formik.values.last_name}
                onChange={formik.handleChange}
              />
            </Flex>
            <Flex direction="column" m={3}>
              <label htmlFor="username">Nickname (optional):</label>
              <Input
                type="text"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
              />
            </Flex>
            <Flex direction="column" m={3}>
              <label htmlFor="date_of_birth">Date of Birth:</label>
              <Input
                type="date"
                name="date_of_birth"
                value={formik.values.date_of_birth}
                onChange={formik.handleChange}
              />
            </Flex>
            <Flex justifyContent="space-evenly" marginY={6}>
              <Button borderRadius="25px" onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="green"
                borderRadius="25px"
                type="submit"
                onClick={onClose}
              >
                Save
              </Button>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProfileModals;
