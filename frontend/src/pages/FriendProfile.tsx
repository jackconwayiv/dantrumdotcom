import { Avatar, Box, Flex, Heading, Tooltip } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { FaBirthdayCake } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { fetchUserById } from "../api/users";
import { Friend } from "../helpers/types";

const FriendProfile = () => {
  const { id } = useParams();
  const [friend, setFriend] = useState<Friend>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown | null | AxiosError>(null);

  useEffect(() => {
    const getFriend = async () => {
      try {
        const data = await fetchUserById(id || "");
        setFriend(data);
        setLoading(false);
      } catch (error: AxiosError | unknown) {
        setError(error);
        setLoading(false);
      }
    };

    getFriend();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    // if (error.response.status === 404) {
    //   return <div>User not found</div>;
    // }
    return <div>Error fetching user: {JSON.stringify(error)}</div>;
  }
  if (friend)
    return (
      <Flex direction="column" width="100%">
        {friend.social_auth && friend.social_auth[0] && (
          <Avatar
            name={friend.username}
            referrerPolicy="no-referrer"
            src={friend.social_auth[0].picture}
            margin={5}
            size="xl"
          />
        )}
        {friend.first_name || friend.last_name ? (
          <Heading size="lg">
            {friend.first_name} {friend.username && `"${friend.username}" `}
            {friend.last_name}
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
            {friend.date_of_birth || "no birthday provided"}
          </Heading>
        </Flex>
        <Heading size="md">{friend.email}</Heading>
      </Flex>
    );

  return <div>User not found</div>;
};

export default FriendProfile;
