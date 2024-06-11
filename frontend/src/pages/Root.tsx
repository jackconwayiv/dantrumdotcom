import { Button, Flex, Heading, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Root() {
  const navigate = useNavigate();
  return (
    <Flex direction="column">
      <Flex direction="column" alignItems="center">
        <Image src="splash_art.jpg" objectFit="cover" width="50%" />
        <Heading mt={6}>EXPLORE DANTRUM</Heading>
        <Flex>
          <Button m={1} onClick={() => navigate("/albums")}>
            Photos
          </Button>
          <Button m={1} onClick={() => navigate("/calendar")}>
            Calendar
          </Button>
          <Button m={1} onClick={() => navigate("/quotes")}>
            Quotes
          </Button>
          <Button m={1} onClick={() => navigate("/resources")}>
            Resources
          </Button>
          <Button m={1} onClick={() => navigate("/friends")}>
            Friends
          </Button>
          <Button m={1} onClick={() => navigate("/profile")}>
            Profile
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
