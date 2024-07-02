import { Avatar, Flex, Text } from "@chakra-ui/react";
import { User } from "./types";

export const isOwner = (user: User, object: any) => {
  return object.owner.email === user.email;
};

export const renderFullName = (user: User) => {
  let nameString = "";
  if (user.first_name) nameString += `${user.first_name} `;
  if (user.username) nameString += ` "${user.username}" `;
  if (user.last_name) nameString += ` ${user.last_name}`;
  return nameString;
};

export const renderSharedBy = (user: User) => {
  const renderNickname = (user: User) => {
    let nameString = "";
    if (user.first_name) nameString += `${user.first_name} `;

    if (user.last_name) nameString += `${user.last_name}`;
    if (user.username) nameString = user.username;
    return (
      <Text fontSize="10px" fontFamily={"Comic Sans MS"} alignItems="end">
        {nameString}
      </Text>
    );
  };
  const renderAvatar = (user: User) => {
    if (
      user.social_auth &&
      user.social_auth[0] &&
      user.social_auth[0].picture
    ) {
      return <Avatar mr={1} size="xs" src={user.social_auth[0].picture} />;
    }
  };

  return (
    <Flex
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      p={1}
    >
      {
        <>
          <Text
            mr={1}
            fontSize="10px"
            fontFamily={"Comic Sans MS"}
            alignItems="end"
          >
            Shared by
          </Text>
          {renderAvatar(user)} {renderNickname(user)}
        </>
      }
    </Flex>
  );
};
