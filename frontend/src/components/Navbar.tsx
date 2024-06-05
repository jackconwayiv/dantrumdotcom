import { Avatar, Flex, Heading, Tooltip } from "@chakra-ui/react";
import {
  FaAddressBook,
  FaCalendarAlt,
  FaCamera,
  FaFeatherAlt,
  FaHome,
  FaMapSigns,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Heading
        size="lg"
        cursor="pointer"
        onClick={() => navigate("/")}
        paddingX="10px"
      >
        DANTRUM.COM
      </Heading>
      <Flex justifyContent="end" marginY="10px">
        <Tooltip label="Home" fontSize="md">
          <Flex paddingX={"10px"}>
            <FaHome
              cursor="pointer"
              size="30px"
              color="brown"
              onClick={() => navigate("/")}
            />
          </Flex>
        </Tooltip>
        <Tooltip label="Calendar" fontSize="md">
          <Flex paddingX={"10px"}>
            <FaCalendarAlt
              cursor="pointer"
              size="30px"
              color="red"
              onClick={() => navigate("/calendar")}
            />
          </Flex>
        </Tooltip>

        <Tooltip label="Photos" fontSize="md">
          <Flex paddingX={"10px"}>
            <FaCamera
              cursor="pointer"
              size="30px"
              color="orange"
              onClick={() => navigate("/albums")}
            />
          </Flex>
        </Tooltip>
        <Tooltip label="Quotes" fontSize="md">
          <Flex paddingX={"10px"}>
            <FaFeatherAlt
              cursor="pointer"
              size="30px"
              color="green"
              onClick={() => navigate("/quotes")}
            />
          </Flex>
        </Tooltip>
        <Tooltip label="Resources" fontSize="md">
          <Flex paddingX={"10px"}>
            <FaMapSigns
              cursor="pointer"
              size="30px"
              color="blue"
              onClick={() => navigate("/resources")}
            />
          </Flex>
        </Tooltip>
        <Tooltip label="Friends" fontSize="md">
          <Flex paddingX={"10px"}>
            <FaAddressBook
              cursor="pointer"
              size="30px"
              color="purple"
              onClick={() => navigate("/users")}
            />
          </Flex>
        </Tooltip>
        <Tooltip label="Profile" fontSize="md">
          <Flex paddingX={"10px"}>
            <Avatar size="sm" />
          </Flex>
        </Tooltip>
      </Flex>
    </Flex>
  );
}

export default Navbar;
