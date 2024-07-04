import {
  Avatar,
  Button,
  Flex,
  Heading,
  Text,
  Wrap,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFriends } from "../api/users";
import { Friend, User } from "../helpers/types";

interface FriendsDirectoryProps {
  user: User;
}

export default function FriendsDirectory({ user }: FriendsDirectoryProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown | null>(null);

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const getFriends = async () => {
      try {
        const data = await fetchFriends();
        setFriends(data.results);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    getFriends();
  }, []);

  const handleToggle = async (userId: number) => {
    try {
      const response = await axios.post(`/api/users/${userId}/activate/`);
      toast({
        title: "Successful activation!",
        description: `${response.data.detail} You've made their day!`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Re-fetch the users list
      const usersResponse = await fetchFriends();
      setFriends(usersResponse.results);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error",
          description:
            error.response?.data?.detail ||
            "An error occurred while toggling user status.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;

  const renderFriendCard = (friend: Friend, i: number) => {
    return (
      <Flex
        key={i}
        m={1}
        height="60px"
        width="100%"
        cursor="pointer"
        alignItems="center"
      >
        <Flex
          p={2}
          width="65px"
          onClick={() => navigate(`/app/friends/${friend.id}`)}
        >
          {friend.social_auth.length > 0 && (
            <Avatar
              name={friend.username}
              referrerPolicy="no-referrer"
              src={friend.social_auth[0].picture}
              size="md"
            />
          )}
        </Flex>
        <Flex
          direction="column"
          p={2}
          onClick={() => navigate(`/app/friends/${friend.id}`)}
        >
          {friend.username && (
            <Text color={!friend.is_active ? "red" : "black"}>
              {friend.username}
            </Text>
          )}
          {friend.first_name || friend.last_name ? (
            <Text color={!friend.is_active ? "red" : "black"}>
              {friend.first_name} {friend.last_name}
            </Text>
          ) : (
            !friend.username &&
            !friend.first_name &&
            !friend.last_name && (
              <Text color={!friend.is_active ? "red" : "black"}>
                {friend.email}
              </Text>
            )
          )}
        </Flex>
        {user.is_staff && !friend.is_active && (
          <Flex alignItems="center" ml="auto" p={2}>
            <Button colorScheme="green" onClick={() => handleToggle(friend.id)}>
              Activate
            </Button>
          </Flex>
        )}
      </Flex>
    );
  };

  return (
    <Flex direction="column" width="100%" p={2}>
      <Heading size="md" fontFamily="Comic Sans MS" mb={4}>
        {friends.length > 0 && friends.length} Friends
      </Heading>

      <Wrap>
        {friends.length > 0 &&
          friends.map((friend, i) => renderFriendCard(friend, i))}
      </Wrap>
    </Flex>
  );
}
