import { Avatar, Card, Flex, Heading, Text, Wrap } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFriends } from "../api/user";
import { FriendType } from "../helpers/types";

export default function Users() {
  const [friends, setFriends] = useState<FriendType[]>([]);
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

  if (friends)
    return (
      <Flex direction="column">
        <Heading>FRIENDS</Heading>

        {friends.length > 0 && (
          <Wrap>
            {friends.map((friend, i) => (
              <Card
                padding={5}
                cursor="pointer"
                height="150px"
                width="300px"
                key={i}
                onClick={() => navigate(`/users/${friend.id}`)}
              >
                {friend.social_auth.length > 0 && (
                  <Avatar
                    name={friend.username}
                    referrerPolicy="no-referrer"
                    src={friend.social_auth[0].picture}
                  />
                )}
                {friend.username ? (
                  <Text>{friend.username}</Text>
                ) : (
                  <Text>
                    {friend.first_name} {friend.last_name}
                  </Text>
                )}
                {friend.email && <Text>{friend.email}</Text>}
                {friend.date_of_birth && <Text>{friend.date_of_birth}</Text>}
              </Card>
            ))}{" "}
          </Wrap>
        )}
      </Flex>
    );
}
