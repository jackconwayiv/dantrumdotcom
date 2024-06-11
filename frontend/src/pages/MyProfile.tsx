import { Button, Flex, Heading, Input } from "@chakra-ui/react";
import { useFormik } from "formik";
import { updateUser } from "../api/users";
import { User } from "../helpers/types";

interface ProfileProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function MyProfile({ user, setUser }: ProfileProps) {
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
    // e.preventDefault();
    try {
      const newUser = await updateUser(values);
      setUser({
        ...user,
        ...newUser,
      });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (user)
    return (
      <Flex direction="column" width="100%">
        <Heading mb={4}>PROFILE</Heading>
        {user.username && <Heading size="md">{user.username}</Heading>}
        <Heading size="md">
          {user.first_name} {user.last_name}
        </Heading>
        <Heading size="md">
          Birthday: {user.date_of_birth || "no name provided"}
        </Heading>
        <Heading size="md">{user.email}</Heading>
        <Heading size="md">Member since {user.date_joined}</Heading>
        <Heading size="md">Last logged in {user.last_login}</Heading>

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
