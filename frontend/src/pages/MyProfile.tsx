import { Button, Flex, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { updateUser } from "../api/users";
import { User } from "../helpers/types";

interface ProfileProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function MyProfile({ user, setUser }: ProfileProps) {
  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    date_of_birth: user.date_of_birth,
  });

  const handleLogoutClick = () => {
    if (window.location.href.includes("localhost")) {
      window.location.href = "http://localhost:8000/logout";
    } else {
      window.location.href = "/logout";
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const newUser = await updateUser(formData);
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
        <Button onClick={handleLogoutClick} mb="1rem">
          Logout
        </Button>

        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Date of Birth:</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Update Profile</button>
        </form>
      </Flex>
    );
}
