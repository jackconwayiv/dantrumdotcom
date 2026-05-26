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
import { FaAddressBook, FaCamera, FaMapSigns, FaStream } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

import { User } from "../helpers/types";
import { navActiveColor } from "../theme/semantic";

interface NavbarProps {
  user: User;
}

const navIconProps = (isActive: boolean) => ({
  size: "30px" as const,
  color: isActive ? navActiveColor : "oasis.text",
  cursor: "pointer" as const,
  _hover: { color: isActive ? navActiveColor : "brand.500" },
  transition: "color 0.15s ease",
});

function Navbar({ user }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const isMobile = useBreakpointValue({ base: true, md: false });

  const isActive = (path: string) =>
    currentPath === path || currentPath.startsWith(`${path}/`);

  if (user)
    return (
      <Flex
        direction="column"
        justifyContent="center"
        maxWidth="800px"
        alignItems="space-between"
        p={2}
        borderBottom="1px solid"
        borderColor="oasis.gray"
        bg="oasis.surface"
      >
        <Flex
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Flex direction="row" alignItems="center" justifyContent="baseline">
            <Image
              height="40px"
              src="/favicon.ico"
              cursor="pointer"
              onClick={() => navigate("/app")}
              alt="D"
            />
            {!isMobile && (
              <Heading
                size="xl"
                cursor="pointer"
                onClick={() => navigate("/app")}
                ml={2}
              >
                ANTRUM
              </Heading>
            )}
          </Flex>
          <Tooltip label="Photos" fontSize="md">
            <Flex>
              <Box
                as={FaCamera}
                {...navIconProps(isActive("/app/albums"))}
                onClick={() => navigate("/app/albums")}
              />
            </Flex>
          </Tooltip>
          <Tooltip label="Timeline" fontSize="md">
            <Flex>
              <Box
                as={FaStream}
                {...navIconProps(isActive("/app/timeline"))}
                onClick={() => navigate("/app/timeline")}
              />
            </Flex>
          </Tooltip>
          <Tooltip label="Resources" fontSize="md">
            <Flex>
              <Box
                as={FaMapSigns}
                {...navIconProps(isActive("/app/resources"))}
                onClick={() => navigate("/app/resources")}
              />
            </Flex>
          </Tooltip>
          <Tooltip label="Friends" fontSize="md">
            <Flex>
              <Box
                as={FaAddressBook}
                {...navIconProps(isActive("/app/friends"))}
                onClick={() => navigate("/app/friends")}
              />
            </Flex>
          </Tooltip>
          <Flex alignItems="baseline" justifyContent="baseline">
            <Avatar
              name={user.username}
              cursor="pointer"
              referrerPolicy="no-referrer"
              border="2px solid"
              borderColor="oasis.gray"
              alignSelf="baseline"
              justifySelf="baseline"
              onClick={() => navigate("/app/profile")}
              _hover={{ borderColor: "brand.500" }}
              src={
                user.social_auth && user.social_auth[0]
                  ? user.social_auth[0].picture
                  : "/avatar.jpg"
              }
            />
          </Flex>
        </Flex>
        <Spacer m={4} />
      </Flex>
    );
}

export default Navbar;
