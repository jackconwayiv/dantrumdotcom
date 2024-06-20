import { Flex, Heading, Image } from "@chakra-ui/react";
import { FaCamera, FaMapSigns } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Root() {
  const navigate = useNavigate();
  return (
    <Flex direction="column">
      <Flex direction="column" alignItems="center">
        <Image
          src="splash_art.jpg"
          objectFit="cover"
          width="50%"
          border="1px black solid"
        />
        <Heading fontFamily="Comic Sans MS" my={6}>
          YO! IT'S DANTRUM.COM
        </Heading>

        <Flex
          alignItems="center"
          width="90%"
          m={2}
          p={2}
          _hover={{ bgColor: "green.100" }}
          cursor="pointer"
          onClick={() => navigate("/albums")}
        >
          <FaCamera size="30px" />
          <Heading m={3} size="md">
            Photos
          </Heading>
        </Flex>
        {/* <Button m={1} onClick={() => navigate("/calendar")}>
          Calendar
        </Button> */}
        {/* <Flex
          alignItems="center"
          width="90%"
          m={2}
          p={2}
          _hover={{ bgColor: "green.100" }}
          cursor="pointer"
          onClick={() => navigate("/quotes")}
        >
          <FaFeatherAlt size="30px" />
          <Heading m={3} size="md">
            Quotes
          </Heading>
        </Flex> */}
        <Flex
          alignItems="center"
          width="90%"
          m={2}
          p={2}
          _hover={{ bgColor: "green.100" }}
          cursor="pointer"
          onClick={() => navigate("/resources")}
        >
          <FaMapSigns size="30px" />
          <Heading m={3} size="md">
            Resources
          </Heading>
        </Flex>
        {/* <Flex
          alignItems="center"
          width="90%"
          m={2}
          p={2}
          _hover={{ bgColor: "green.100" }}
          cursor="pointer"
          onClick={() => navigate("/friends")}
        >
          <FaAddressBook size="30px" />
          <Heading m={3} size="md">
            Friends
          </Heading>
        </Flex> */}
        {/* <Flex
          alignItems="center"
          width="90%"
          m={2}
          p={2}
          _hover={{ bgColor: "green.100" }}
          cursor="pointer"
          onClick={() => navigate("/profile")}
        >
          <FaUserCircle size="30px" />
          <Heading m={3} size="md">
            Profile
          </Heading>
        </Flex> */}
      </Flex>
    </Flex>
  );
}
