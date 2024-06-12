import { Avatar, Flex, Heading, Image, Tooltip } from "@chakra-ui/react";
import {
  FaAddressBook,
  FaCalendarAlt,
  FaCamera,
  FaFeatherAlt,
  FaMapSigns,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { User } from "../helpers/types";

interface NavbarProps {
  user: User;
}

function Navbar({ user }: NavbarProps) {
  const navigate = useNavigate();

  if (user)
    return (
      <Flex bgColor="white" direction="column" justifyContent="space-between">
        <Flex direction="row" alignItems="center" justifyContent="baseline">
          <Image
            height="40px"
            src="favicon.ico"
            cursor="pointer"
            onClick={() => navigate("/")}
            m={1}
            mr={0}
          />
          <Heading size="lg" cursor="pointer" onClick={() => navigate("/")}>
            ANTRUM.COM
          </Heading>
        </Flex>
        <Flex justifyContent="space-between" p={3}>
          <Tooltip label="Photos" fontSize="md">
            <Flex paddingX={2}>
              <FaCamera
                cursor="pointer"
                size="20px"
                // color="red"
                onClick={() => navigate("/albums")}
              />
            </Flex>
          </Tooltip>
          <Tooltip label="Calendar" fontSize="md">
            <Flex paddingX={2}>
              <FaCalendarAlt
                cursor="pointer"
                size="20px"
                // color="orange"
                onClick={() => navigate("/calendar")}
              />
            </Flex>
          </Tooltip>
          <Tooltip label="Quotes" fontSize="md">
            <Flex paddingX={2}>
              <FaFeatherAlt
                cursor="pointer"
                size="20px"
                // color="green"
                onClick={() => navigate("/quotes")}
              />
            </Flex>
          </Tooltip>
          <Tooltip label="Resources" fontSize="md">
            <Flex paddingX={2}>
              <FaMapSigns
                cursor="pointer"
                size="20px"
                // color="blue"
                onClick={() => navigate("/resources")}
              />
            </Flex>
          </Tooltip>
          <Tooltip label="Friends" fontSize="md">
            <Flex paddingX={2}>
              <FaAddressBook
                cursor="pointer"
                size="20px"
                // color="purple"
                onClick={() => navigate("/friends")}
              />
            </Flex>
          </Tooltip>
          <Tooltip label="Profile" fontSize="md">
            <Flex paddingX={2}>
              <Avatar
                name={user.username}
                cursor="pointer"
                referrerPolicy="no-referrer"
                src={
                  user.social_auth &&
                  user.social_auth[0] &&
                  user.social_auth[0].picture
                }
                size="xs"
                mr={1}
                onClick={() => navigate("/profile")}
              />
            </Flex>
          </Tooltip>
        </Flex>
      </Flex>
    );
}

export default Navbar;
