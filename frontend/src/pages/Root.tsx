import { Flex, Heading } from "@chakra-ui/react";
import { FaCamera, FaMapSigns, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ImageCarousel from "../components/ImageCarousel";

export default function Root() {
  const navigate = useNavigate();
  return (
    <Flex direction="column">
      <ImageCarousel />
      <Flex direction="column" alignItems="center" p={2}>
        {/* <Image
          src="splash_art.jpg"
          objectFit="cover"
          width="50%"
          border="1px black solid"
        /> */}

        <Heading textAlign="center" fontFamily="Comic Sans MS" my={6}>
          YO! IT'S DANTRUM.COM
        </Heading>

        <Flex
          alignItems="center"
          width="90%"
          m={2}
          p={2}
          _hover={{ bgColor: "green.100" }}
          cursor="pointer"
          onClick={() => navigate("/app/albums")}
        >
          <FaCamera size="30px" />
          <Heading m={3} size="md">
            Photos
          </Heading>
        </Flex>
        {/* <Button m={1} onClick={() => navigate("/app/calendar")}>
          Calendar
        </Button> */}
        {/* <Flex
          alignItems="center"
          width="90%"
          m={2}
          p={2}
          _hover={{ bgColor: "green.100" }}
          cursor="pointer"
          onClick={() => navigate("/app/quotes")}
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
          onClick={() => navigate("/app/resources")}
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
          onClick={() => navigate("/app/friends")}
        >
          <FaAddressBook size="30px" />
          <Heading m={3} size="md">
            Friends
          </Heading>
        </Flex> */}
        <Flex
          alignItems="center"
          width="90%"
          m={2}
          p={2}
          _hover={{ bgColor: "green.100" }}
          cursor="pointer"
          onClick={() => navigate("/app/profile")}
        >
          <FaUserCircle size="30px" />
          <Heading m={3} size="md">
            Profile
          </Heading>
        </Flex>
      </Flex>
    </Flex>
  );
}
