import { Avatar, Flex, Text, Wrap, useToast } from "@chakra-ui/react";
import AppButton from "../components/ui/AppButton";
import PageHeading from "../components/ui/PageHeading";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { activateUser, fetchFriends } from "../api/users";
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
      const data = await fetchFriends();
      if (data) {
        setFriends(data.results);
        setLoading(false);
      } else {
        setError(new Error("Couldn't retrieve friends"));
        setLoading(false);
      }
    };

    getFriends();
  }, []);

  useEffect(() => {
    const sortFriendsByBirthday = () => {
      const sorted = friends
        .filter((friend) => friend.email !== user.email)
        .sort((a, b) => {
          const nextBirthdayA = getNextBirthday(a.date_of_birth);
          const nextBirthdayB = getNextBirthday(b.date_of_birth);
          if (nextBirthdayA === 0 && nextBirthdayB === 0) return 0;
          if (nextBirthdayA === 0) return 1;
          if (nextBirthdayB === 0) return -1;

          return nextBirthdayA - nextBirthdayB;
        });
      setSortedFriends(sorted);
    };

    if (friends.length > 0) {
      sortFriendsByBirthday();
    }
  }, [friends, user.email]);

  const handleToggle = async (userId: number) => {
    const result = await activateUser(userId);
    if (result) {
      toast({
        title: "Successful user activation!",
        description: `You've made their day!`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setFriends((prev) =>
        prev.map((friend) =>
          friend.id === userId ? { ...friend, is_active: true } : friend
        )
      );
    } else {
      toast({
        title: "Error!",
        description:
          "An error occurred while trying to toggle this user's status.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
          <Avatar
            name={friend.username}
            referrerPolicy="no-referrer"
            src={
              friend.social_auth && friend.social_auth[0]
                ? friend.social_auth[0].picture
                : "/avatar.jpg"
            }
            size="md"
          />
        </Flex>
        <Flex
          direction="column"
          p={2}
          onClick={() => navigate(`/app/friends/${friend.id}`)}
        >
          {renderFullName(friend)}
          {friend.date_of_birth && (
            <Flex alignItems="center">
              <Text
                color={isBirthday(friend) ? "oasis.orange.600" : "oasis.text"}
                fontWeight={isBirthday(friend) ? "bold" : "normal"}
              >
                🎂 {renderBirthday(friend.date_of_birth)}
              </Text>
            </Flex>
          )}
        </Flex>
        {user.is_staff && !friend.is_active && (
          <Flex alignItems="center" ml="auto" p={2}>
            <AppButton colorTone="success" onClick={() => handleToggle(friend.id)}>
              Activate
            </AppButton>
          </Flex>
        )}
      </Flex>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;

  return (
    <Flex direction="column" width="100%" p={2}>
      <PageHeading size="md">
        {friends.length > 0 && friends.length - 1} Friends
      </PageHeading>

      <Wrap>
        {sortedFriends.length > 0 &&
          sortedFriends.map((friend, i) => renderFriendCard(friend, i))}
      </Wrap>
    </Flex>
  );
}
