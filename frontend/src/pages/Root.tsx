import { Flex, Heading, Text } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaAddressBook,
  FaCamera,
  FaMapSigns,
  FaUserCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ImageCarousel from "../components/ImageCarousel";
import { User } from "../helpers/types";
import { isBirthday, renderBirthday, renderNickname } from "../helpers/utils";

interface RootProps {
  user: User;
}

export default function Root({ user }: RootProps) {
  const [birthdays, setBirthdays] = useState<User[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcomingBirthdays = async () => {
      try {
        const response = await axios.get<User[]>("/api/birthdays/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace with your auth method
          },
        });
        setBirthdays(response.data);
      } catch (err) {
        // setError("Failed to fetch upcoming birthdays");
      } finally {
        // setLoading(false);
      }
    };

    fetchUpcomingBirthdays();
  }, []);

  const renderList = () => {
    return birthdays.map((user: User, i: number) => (
      <Text key={i}>
        {`${renderNickname(user)}: ${renderBirthday(user.date_of_birth)}`}
      </Text>
    ));
  };

  const renderBirthdays = () => {
    if (birthdays && birthdays.length > 0) {
      return (
        <Flex direction="column" alignItems="center">
          <Text fontWeight="bold" fontFamily="Comic Sans MS">
            🎉 UPCOMING {birthdays.length > 1 ? `BIRTHDAYS` : `BIRTHDAY`} ALERT!
          </Text>
          <Text fontFamily="Comic Sans MS"></Text>
          {renderList()}
        </Flex>
      );
    }
    return null;
  };

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
          {isBirthday(user)
            ? `HAPPY BIRTHDAY ${renderNickname(user).toUpperCase()}!!`
            : `YO! IT'S DANTRUM.COM`}
        </Heading>
        {birthdays && birthdays.length > 0 && renderBirthdays()}

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
        <Flex
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
        </Flex>
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
