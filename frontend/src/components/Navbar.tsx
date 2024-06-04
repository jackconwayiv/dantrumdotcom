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
    <Flex width="100vw" justifyContent="space-between" alignItems="center">
      <Heading
        size="lg"
        cursor="pointer"
        onClick={() => navigate("/")}
        margin="10px"
      >
        DANTRUM.COM
      </Heading>
      <Flex width="40vw" justifyContent="space-evenly" margin="20px">
        <Tooltip label="Home" fontSize="md">
          <span>
            <FaHome
              cursor="pointer"
              size="30px"
              onClick={() => navigate("/")}
            />
          </span>
        </Tooltip>
        <Tooltip label="Calendar" fontSize="md">
          <span>
            <FaCalendarAlt
              cursor="pointer"
              size="30px"
              onClick={() => navigate("/calendar")}
            />
          </span>
        </Tooltip>

        <Tooltip label="Photos" fontSize="md">
          <span>
            <FaCamera
              cursor="pointer"
              size="30px"
              onClick={() => navigate("/albums")}
            />
          </span>
        </Tooltip>
        <Tooltip label="Quotes" fontSize="md">
          <span>
            <FaFeatherAlt
              cursor="pointer"
              size="30px"
              onClick={() => navigate("/quotes")}
            />
          </span>
        </Tooltip>
        <Tooltip label="Resources" fontSize="md">
          <span>
            <FaMapSigns
              cursor="pointer"
              size="30px"
              onClick={() => navigate("/resources")}
            />
          </span>
        </Tooltip>
        <Tooltip label="Friends" fontSize="md">
          <span>
            <FaAddressBook
              cursor="pointer"
              size="30px"
              onClick={() => navigate("/users")}
            />
          </span>
        </Tooltip>
        <Tooltip label="Profile" fontSize="md">
          <Avatar size="sm" />
        </Tooltip>
      </Flex>
    </Flex>
  );
}

export default Navbar;
