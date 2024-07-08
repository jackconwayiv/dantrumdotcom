import {
  Avatar,
  Button,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { isAxiosError } from "axios";
import { useFormik } from "formik";
import { FaSignOutAlt } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { updateUser } from "../api/users";
import { User } from "../helpers/types";
import { renderBirthday, renderFullName } from "../helpers/utils";

interface ProfileProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function MyProfile({ user, setUser }: ProfileProps) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const formik = useFormik({
    initialValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      date_of_birth: user.date_of_birth,
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleLogoutClick = () => {
    if (window.location.href.includes("localhost")) {
      window.location.href = "http://localhost:8000/logout";
    } else {
      window.location.href = "/logout";
    }
  };

  const handleSubmit = async (values: User) => {
    try {
      const newUser = await updateUser(values);
      setUser({
        ...user,
        ...newUser,
      });
      toast({
        title: "Profile updated.",
        description: "Now look at you!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error: unknown) {
      let errorMessage = "Check console log for details.";

      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Error updating user:", error);
      toast({
        title: "Error updating your profile:",
        description: errorMessage,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  if (user)
    //otherwise, handle error
    return (
      <Flex direction="column" width="100%">
        <Flex alignItems="center" justifyContent="space-between" m={4}>
          <Avatar
            name={user.username}
            referrerPolicy="no-referrer"
            src={
              user.social_auth && user.social_auth[0]
                ? user.social_auth[0].picture
                : "/avatar.jpg"
            }
            margin={5}
            size="xl"
          />
        </Flex>
        <Flex m={5} direction="column">
          <Heading size="lg" m={4}>
            {renderFullName(user)}
          </Heading>
          <Flex alignItems="center" m={4}>
            <Heading size="md">
              🎂 {renderBirthday(user.date_of_birth) || "no birthday provided"}
            </Heading>
          </Flex>
          <Heading size="md" m={4}>
            {user.email}
          </Heading>
        </Flex>
        <Flex direction="column" m={4}>
          <Button
            width="120px"
            borderRadius="25px"
            variant="outline"
            colorScheme="green"
            m={4}
            leftIcon={<FaGear />}
            onClick={onOpen}
          >
            Edit Profile
          </Button>
          <Button
            width="120px"
            variant="outline"
            m={4}
            colorScheme="red"
            borderRadius="25px"
            leftIcon={<FaSignOutAlt />}
            onClick={handleLogoutClick}
          >
            Logout
          </Button>
        </Flex>

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
      </Flex>
    );
}
