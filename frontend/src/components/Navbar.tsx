import {
  Avatar,
  Box,
  Flex,
  Heading,
  Image,
  Spacer,
  Tooltip,
} from "@chakra-ui/react";
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
      <Flex
        direction="column"
        justifyContent="center"
        maxWidth="800px"
        alignItems="space-between"
      >
        <Flex
          direction="row"
          alignItems="baseline"
          justifyContent="space-between"
        >
          <Flex direction="row" alignItems="center" justifyContent="baseline">
            <Image
              height="40px"
              src="favicon.ico"
              cursor="pointer"
              onClick={() => navigate("/")}
              alt="D"
            />
            <Heading
              fontFamily="Tahoma"
              size="xl"
              cursor="pointer"
              onClick={() => navigate("/")}
            >
              ANTRUM.COM
            </Heading>
          </Flex>
          <Spacer />
          <Tooltip label="Profile" fontSize="md">
            <Flex>
              <Avatar
                name={user.username}
                size="md"
                cursor="pointer"
                referrerPolicy="no-referrer"
                border="1px silver solid"
                src={
                  user.social_auth &&
                  user.social_auth[0] &&
                  user.social_auth[0].picture
                }
                onClick={() => navigate("/profile")}
              />
            </Flex>
          </Tooltip>
        </Flex>
        <Spacer m={4} />
        <Flex justifyContent="space-between">
          <Tooltip label="Photos" fontSize="md">
            <Flex>
              <Box
                as={FaCamera}
                size="30px"
                color={currentPath === "/albums" ? "green.500" : "black"}
                _hover={{ color: "green.300" }}
                cursor="pointer"
                onClick={() => navigate("/albums")}
              />
            </Flex>
          </Tooltip>
          <Tooltip label="Calendar" fontSize="md">
            <Flex>
              <Box
                as={FaCalendarAlt}
                size="30px"
                color={currentPath === "/calendar" ? "green.500" : "black"}
                _hover={{ color: "green.300" }}
                cursor="pointer"
                onClick={() => navigate("/calendar")}
              />
            </Flex>
          </Tooltip>
          <Tooltip label="Quotes" fontSize="md">
            <Flex>
              <Box
                as={FaFeatherAlt}
                size="30px"
                color={currentPath === "/quotes" ? "green.500" : "black"}
                _hover={{ color: "green.300" }}
                cursor="pointer"
                onClick={() => navigate("/quotes")}
              />
            </Flex>
          </Tooltip>
          <Tooltip label="Resources" fontSize="md">
            <Flex>
              <Box
                as={FaMapSigns}
                size="30px"
                color={currentPath === "/resources" ? "green.500" : "black"}
                _hover={{ color: "green.300" }}
                cursor="pointer"
                onClick={() => navigate("/resources")}
              />
            </Flex>
          </Tooltip>
          <Tooltip label="Friends" fontSize="md">
            <Flex>
              <Box
                as={FaAddressBook}
                size="30px"
                color={currentPath === "/friends" ? "green.500" : "black"}
                _hover={{ color: "green.300" }}
                cursor="pointer"
                onClick={() => navigate("/friends")}
              />
            </Flex>
          </Tooltip>
        </Flex>
        <Spacer m={4} />
      </Flex>
    );
}

export default Navbar;
