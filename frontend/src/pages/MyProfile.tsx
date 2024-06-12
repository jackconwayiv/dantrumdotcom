import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { isAxiosError } from "axios";
import { useFormik } from "formik";
import { FaBirthdayCake } from "react-icons/fa";
import { updateUser } from "../api/users";
import { User } from "../helpers/types";

interface ProfileProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function MyProfile({ user, setUser }: ProfileProps) {
  const toast = useToast();
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
    return (
      <Flex direction="column" width="100%">
        {user.social_auth && user.social_auth[0] && (
          <Avatar
            name={user.username}
            referrerPolicy="no-referrer"
            src={user.social_auth[0].picture}
            margin={5}
            size="xl"
          />
        )}
        {user.first_name || user.last_name ? (
          <Heading size="lg">
            {user.first_name} {user.username && `"${user.username}" `}
            {user.last_name}
          </Heading>
        ) : (
          <Heading size="lg">no name on record</Heading>
        )}
        <Flex alignItems="center">
          <Tooltip label="Birthday" fontSize="md">
            <Box mr={3}>
              <FaBirthdayCake />
            </Box>
          </Tooltip>
          <Heading size="md">
            {user.date_of_birth || "no birthday provided"}
          </Heading>
        </Flex>
        <Heading size="md">{user.email}</Heading>
        {/* <Heading size="md">Member since {user.date_joined}</Heading>
        <Heading size="md">Last logged in {user.last_login}</Heading> */}

        <form onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor="first_name">First Name:</label>
            <Input
              mt={2}
              type="text"
              name="first_name"
              value={formik.values.first_name}
              onChange={formik.handleChange}
            />
          </div>
          <div>
            <label htmlFor="last_name">Last Name:</label>
            <Input
              mt={2}
              type="text"
              name="last_name"
              value={formik.values.last_name}
              onChange={formik.handleChange}
            />
          </div>
          <div>
            <label htmlFor="username">Nickname (or leave blank):</label>
            <Input
              mt={2}
              type="text"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
            />
          </div>
          <div>
            <label htmlFor="date_of_birth">Date of Birth:</label>
            <Input
              mt={2}
              type="date"
              name="date_of_birth"
              value={formik.values.date_of_birth}
              onChange={formik.handleChange}
            />
          </div>
          <Button mt={2} type="submit">
            Update Profile
          </Button>
        </form>
        <Button mt={2} onClick={handleLogoutClick}>
          Logout
        </Button>
      </Flex>
    );
}
