import { Avatar, Box, Flex, Heading, Image, Tooltip } from "@chakra-ui/react";
import {
  FaAddressBook,
  FaCalendarAlt,
  FaCamera,
  FaFeatherAlt,
  FaMapSigns,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

import { User } from "../helpers/types";

interface NavbarProps {
  user: User;
}

function Navbar({ user }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  if (user)
    return (
      <Flex bgColor="white" direction="column" justifyContent="space-between">
        <Flex
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Flex direction="row" alignItems="center" justifyContent="baseline">
            <Image
              height="40px"
              src="favicon.ico"
              cursor="pointer"
              onClick={() => navigate("/")}
              alt="D"
              ml={1}
              mt={1}
              mr={0}
              mb={0}
            />
            <Heading
              fontFamily={"Comic Sans MS"}
              size="lg"
              cursor="pointer"
              onClick={() => navigate("/")}
            >
              ANTRUM.COM
            </Heading>
          </Flex>
          <Tooltip label="Profile" fontSize="md">
            <Flex mr={1}>
              <Avatar
                name={user.username}
                cursor="pointer"
                referrerPolicy="no-referrer"
                src={
                  user.social_auth &&
                  user.social_auth[0] &&
                  user.social_auth[0].picture
                }
                size="sm"
                mr={1}
                onClick={() => navigate("/profile")}
              />
            </Flex>
          </Tooltip>
        </Flex>
        <Flex justifyContent="space-between" paddingX={2} m={2}>
          <Tooltip label="Photos" fontSize="md">
            <Flex paddingX={2}>
              <Box
                as={FaCamera}
                size="24px"
                color={currentPath === "/albums" ? "green.500" : "black"}
                _hover={{ color: "green.300" }}
                cursor="pointer"
                onClick={() => navigate("/albums")}
              />
            </Flex>
          </Tooltip>
          <Tooltip label="Calendar" fontSize="md">
            <Flex paddingX={2}>
              <Box
                as={FaCalendarAlt}
                size="24px"
                color={currentPath === "/calendar" ? "green.500" : "black"}
                _hover={{ color: "green.300" }}
                cursor="pointer"
                onClick={() => navigate("/calendar")}
              />
            </Flex>
          </Tooltip>
          <Tooltip label="Quotes" fontSize="md">
            <Flex paddingX={2}>
              <Box
                as={FaFeatherAlt}
                size="24px"
                color={currentPath === "/quotes" ? "green.500" : "black"}
                _hover={{ color: "green.300" }}
                cursor="pointer"
                onClick={() => navigate("/quotes")}
              />
            </Flex>
          </Tooltip>
          <Tooltip label="Resources" fontSize="md">
            <Flex paddingX={2}>
              <Box
                as={FaMapSigns}
                size="24px"
                color={currentPath === "/resources" ? "green.500" : "black"}
                _hover={{ color: "green.300" }}
                cursor="pointer"
                onClick={() => navigate("/resources")}
              />
            </Flex>
          </Tooltip>
          <Tooltip label="Friends" fontSize="md">
            <Flex paddingX={2}>
              <Box
                as={FaAddressBook}
                size="24px"
                color={currentPath === "/friends" ? "green.500" : "black"}
                _hover={{ color: "green.300" }}
                cursor="pointer"
                onClick={() => navigate("/friends")}
              />
            </Flex>
          </Tooltip>
        </Flex>
      </Flex>
    );
}

export default Navbar;
