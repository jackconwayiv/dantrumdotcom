import { Avatar, Flex, Heading, Image, Tooltip } from "@chakra-ui/react";
import {
  FaAddressBook,
  FaCalendarAlt,
  FaCamera,
  FaFeatherAlt,
  FaMapSigns,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { UserType } from "../helpers/types";

interface NavbarProps {
  user: UserType;
}

function Navbar({ user }: NavbarProps) {
  const navigate = useNavigate();

  if (user)
    return (
      <Flex direction="column" mb={3}>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex direction="row" alignItems="center" justifyContent="baseline">
            <Image
              height="50px"
              src="favicon.ico"
              cursor="pointer"
              onClick={() => navigate("/")}
            />
            <Heading size="lg" cursor="pointer" onClick={() => navigate("/")}>
              ANTRUM.COM
            </Heading>
          </Flex>
          <Flex justifyContent="end">
            <Tooltip label="Photos" fontSize="md">
              <Flex paddingX={2}>
                <FaCamera
                  cursor="pointer"
                  size="30px"
                  color="red"
                  onClick={() => navigate("/albums")}
                />
              </Flex>
            </Tooltip>
            <Tooltip label="Calendar" fontSize="md">
              <Flex paddingX={2}>
                <FaCalendarAlt
                  cursor="pointer"
                  size="30px"
                  color="orange"
                  onClick={() => navigate("/calendar")}
                />
              </Flex>
            </Tooltip>
            <Tooltip label="Quotes" fontSize="md">
              <Flex paddingX={2}>
                <FaFeatherAlt
                  cursor="pointer"
                  size="30px"
                  color="green"
                  onClick={() => navigate("/quotes")}
                />
              </Flex>
            </Tooltip>
            <Tooltip label="Resources" fontSize="md">
              <Flex paddingX={2}>
                <FaMapSigns
                  cursor="pointer"
                  size="30px"
                  color="blue"
                  onClick={() => navigate("/resources")}
                />
              </Flex>
            </Tooltip>
            <Tooltip label="Friends" fontSize="md">
              <Flex paddingX={2}>
                <FaAddressBook
                  cursor="pointer"
                  size="30px"
                  color="purple"
                  onClick={() => navigate("/users")}
                />
              </Flex>
            </Tooltip>
            <Tooltip label="Profile" fontSize="md">
              <Flex paddingX={2}>
                <Avatar
                  name={user.username}
                  cursor="pointer"
                  referrerPolicy="no-referrer"
                  src={user.social_auth[0] && user.social_auth[0].picture}
                  size="sm"
                  onClick={() => navigate("/profile")}
                />
              </Flex>
            </Tooltip>
          </Flex>
        </Flex>
        <hr />
      </Flex>
    );
}

export default Navbar;
