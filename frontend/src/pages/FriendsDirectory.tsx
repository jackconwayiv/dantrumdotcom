import { Avatar, Flex, Heading, Text, Wrap } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFriends } from "../api/users";
import { Friend } from "../helpers/types";

export default function FriendsDirectory() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown | null>(null);

  const navigate = useNavigate();

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
        onClick={() => navigate(`/friends/${friend.id}`)}
        alignItems="center"
      >
        <Flex p={2} width="65px">
          {friend.social_auth.length > 0 && (
            <Avatar
              name={friend.username}
              referrerPolicy="no-referrer"
              src={friend.social_auth[0].picture}
              size="md"
            />
          )}
        </Flex>
        <Flex direction="column" p={2}>
          {friend.username && <Text>{friend.username}</Text>}
          {friend.username && (
            <Text>
              {friend.first_name} {friend.last_name}
            </Text>
          )}
          {!friend.username && !friend.first_name && !friend.last_name && (
            <Text>{friend.email}</Text>
          )}
        </Flex>
      </Flex>
    );
  };

  if (friends) //else handle error
    return (
      <Flex direction="column" width="100%">
        <Heading size="md" fontFamily="Comic Sans MS">
          {friends.length > 0 && friends.length} Friends
        </Heading>

        <Wrap>
          {friends.length > 0 &&
            friends.map((friend, i) => renderFriendCard(friend, i))}
        </Wrap>
        {/* {friends.map((friend, i) => (
              <Card
                padding={3}
                cursor="pointer"
                height="175px"
                width="300px"
                key={i}
                alignItems="center"
                onClick={() => navigate(`/friends/${friend.id}`)}
              >
                {friend.social_auth.length > 0 && (
                  <Avatar
                    name={friend.username}
                    referrerPolicy="no-referrer"
                    src={friend.social_auth[0].picture}
                  />
                )}
                {friend.username && <Text>{friend.username}</Text>}
                {friend.username && (
                  <Text>
                    {friend.first_name} {friend.last_name}
                  </Text>
                )}
                {friend.email && <Text>{friend.email}</Text>}
                {friend.date_of_birth && <Text>{friend.date_of_birth}</Text>}
              </Card>
            ))}{" "}  */}
      </Flex>
    );
}
