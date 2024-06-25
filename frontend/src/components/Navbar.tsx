import {
  Avatar,
  Box,
  Flex,
  Heading,
  Image,
  Spacer,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaCamera, FaMapSigns } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

import { User } from "../helpers/types";

interface NavbarProps {
  user: User;
}

function Navbar({ user }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const isMobile = useBreakpointValue({ base: true, md: false });
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
          alignItems="center"
          justifyContent="space-between"
        >
          <Flex direction="row" alignItems="center" justifyContent="baseline">
            <Image
              height="40px"
              src="favicon.ico"
              cursor="pointer"
              onClick={() => navigate("/home")}
              alt="D"
            />
            {!isMobile && (
              <Heading
                fontFamily="Tahoma"
                size="xl"
                cursor="pointer"
                onClick={() => navigate("/home")}
              >
                ANTRUM.COM
              </Heading>
            )}
          </Flex>
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
          {/* <Tooltip label="Calendar" fontSize="md">
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
          </Tooltip> */}
          {/* <Tooltip label="Quotes" fontSize="md">
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
          </Tooltip> */}
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
          {/* <Tooltip label="Friends" fontSize="md">
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
          </Tooltip> */}
          <Flex alignItems="baseline" justifyContent="baseline">
            {/* <Box m={0} p={0}>
              <Menu>
                <MenuButton
                  as={Flex}
                  alignItems="baseline"
                  justifyContent="baseline"
                > */}
            <Avatar
              name={user.username}
              cursor="pointer"
              referrerPolicy="no-referrer"
              border="1px silver solid"
              alignSelf="baseline"
              justifySelf="baseline"
              onClick={() => navigate("/profile")}
              src={
                user.social_auth &&
                user.social_auth[0] &&
                user.social_auth[0].picture
              }
            />
            {/* </MenuButton>
                <MenuList>
                  <MenuItem
                    icon={<FaGear />}
                    onClick={() => navigate("/profile")}
                  >
                    Edit Profile
                  </MenuItem>
                  <MenuItem icon={<FaSignOutAlt />}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Box> */}
          </Flex>
        </Flex>
        <Spacer m={4} />
      </Flex>
    );
}

export default Navbar;
