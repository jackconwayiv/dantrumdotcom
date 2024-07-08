import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Wrap,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaBirthdayCake } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchFriends } from "../api/users";
import { Friend, User } from "../helpers/types";
import {
  getNextBirthday,
  isBirthday,
  renderBirthday,
  renderFullName,
} from "../helpers/utils";

interface FriendsDirectoryProps {
  user: User;
}
export default function FriendsDirectory({ user }: FriendsDirectoryProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [sortedFriends, setSortedFriends] = useState<Friend[]>([]);
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

  useEffect(() => {
    const sortFriendsByBirthday = () => {
      const sorted = friends
        .filter((friend) => friend.email !== user.email)
        .sort(
          (a, b) =>
            getNextBirthday(a.date_of_birth) - getNextBirthday(b.date_of_birth)
        );
      setSortedFriends(sorted);
    };

    if (friends.length > 0) {
      sortFriendsByBirthday();
    }
  }, [friends, user.email]);

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
          {renderFullName(friend)}
          {friend.date_of_birth && (
            <Flex alignItems="center">
              <Box mr={1}>
                <FaBirthdayCake
                  color={isBirthday(friend) ? "orange" : "black"}
                />
              </Box>
              <Text
                color={isBirthday(friend) ? "orange" : "black"}
                fontWeight={isBirthday(friend) ? "bold" : "normal"}
              >
                {renderBirthday(friend.date_of_birth)}
              </Text>
            </Flex>
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;

  return (
    <Flex direction="column" width="100%" p={2}>
      <Heading size="md" fontFamily="Comic Sans MS" mb={4}>
        {friends.length > 0 && friends.length - 1} Friends
      </Heading>

      <Wrap>
        {sortedFriends.length > 0 &&
          sortedFriends.map((friend, i) => renderFriendCard(friend, i))}
      </Wrap>
    </Flex>
  );
}