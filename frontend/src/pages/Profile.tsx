import { Button, Flex, Heading } from "@chakra-ui/react";
import { UserType } from "../helpers/types";

interface ProfileProps {
  user: UserType;
}

export default function Profile({ user }: ProfileProps) {
  const handleClick = () => {
    if (window.location.href.includes("localhost")) {
      window.location.href = "http://localhost:8000/logout";
    } else {
      window.location.href = "/logout";
    }
  };

  if (user)
    return (
      <Flex direction="column">
        <Heading mb={4}>PROFILE</Heading>
        <Heading size="md">{user.username || "none"}</Heading>
        <Heading size="md">
          {user.first_name} {user.last_name}
        </Heading>
        <Heading size="md">Birthday: {user.date_of_birth || "none"}</Heading>
        <Heading size="md">{user.email}</Heading>
        <Heading size="md">Member since {user.date_joined}</Heading>
        <Heading size="md">Last logged in {user.last_login}</Heading>
        <Button onClick={handleClick} mb="1rem">
          Logout
        </Button>
      </Flex>
    );
}
