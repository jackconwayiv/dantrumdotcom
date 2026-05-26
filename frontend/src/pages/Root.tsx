import { Box, Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { fetchUpcomingBirthdays } from "../api/birthdays";
import {
  FaAddressBook,
  FaCamera,
  FaMapSigns,
  FaStream,
  FaUserCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AccentFeature from "../components/ui/AccentFeature";
import HomeRecentCarousel from "../components/HomeRecentCarousel";
import { User } from "../helpers/types";
import { isBirthday, renderBirthday, renderNickname } from "../helpers/utils";

interface RootProps {
  user: User;
}

export default function Root({ user }: RootProps) {
  const [birthdays, setBirthdays] = useState<User[]>([]);
  const [, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadBirthdays = async () => {
      const data = await fetchUpcomingBirthdays();
      if (data) {
        setBirthdays(data);
      } else {
        setError("Failed to fetch upcoming birthdays");
      }
    };
    loadBirthdays();
  }, []);

  const renderList = () => {
    return birthdays.map((birthdayUser: User, i: number) => (
      <Text
        cursor="pointer"
        key={i}
        onClick={() => navigate(`/app/friends/${birthdayUser.id}`)}
        _hover={{ color: "brand.600" }}
      >
        {`${renderNickname(birthdayUser)}: ${renderBirthday(birthdayUser.date_of_birth)}`}
      </Text>
    ));
  };

  const renderBirthdays = () => {
    if (birthdays && birthdays.length > 0) {
      return (
        <Box
          bg="oasis.orange.100"
          border="1px solid"
          borderColor="oasis.gray"
          borderRadius="card"
          p={4}
          mb={4}
          width="90%"
        >
          <Text fontWeight="bold" color="oasis.orange.600" mb={2}>
            🎉 UPCOMING {birthdays.length > 1 ? `BIRTHDAYS` : `BIRTHDAY`} ALERT!
          </Text>
          {renderList()}
        </Box>
      );
    }
    return null;
  };

  return (
    <Flex direction="column" alignItems="center" p={4}>
      <Heading textAlign="center" size="xl" my={6}>
        {isBirthday(user)
          ? `HAPPY BIRTHDAY ${renderNickname(user).toUpperCase()}!!`
          : `YO! IT'S DANTRUM`}
      </Heading>

      {birthdays && birthdays.length > 0 && renderBirthdays()}

      <HomeRecentCarousel />

      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        spacing={3}
        width="95%"
        mt={2}
      >
        <AccentFeature
          accent="purple"
          width="100%"
          onClick={() => navigate("/app/albums")}
        >
          <FaCamera size="30px" color="var(--purple)" />
          <Heading m={3} size="md" color="oasis.text">
            Photos
          </Heading>
        </AccentFeature>

        <AccentFeature
          accent="green"
          width="100%"
          onClick={() => navigate("/app/timeline")}
        >
          <FaStream size="30px" color="var(--green)" />
          <Heading m={3} size="md" color="oasis.text">
            Timeline
          </Heading>
        </AccentFeature>

        <AccentFeature
          accent="orange"
          width="100%"
          onClick={() => navigate("/app/resources")}
        >
          <FaMapSigns size="30px" color="var(--orange)" />
          <Heading m={3} size="md" color="oasis.text">
            Resources
          </Heading>
        </AccentFeature>

        <AccentFeature
          accent="purple"
          width="100%"
          onClick={() => navigate("/app/friends")}
        >
          <FaAddressBook size="30px" color="var(--purple)" />
          <Heading m={3} size="md" color="oasis.text">
            Friends
          </Heading>
        </AccentFeature>

        <AccentFeature
          accent="green"
          width="100%"
          onClick={() => navigate("/app/profile")}
        >
          <FaUserCircle size="30px" color="var(--green)" />
          <Heading m={3} size="md" color="oasis.text">
            Profile
          </Heading>
        </AccentFeature>
      </SimpleGrid>
    </Flex>
  );
}
