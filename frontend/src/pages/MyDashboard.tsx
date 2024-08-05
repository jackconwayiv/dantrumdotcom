import {
  Button,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { FaSignOutAlt } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { updateUser } from "../api/users";
import ProfileModals from "../components/ProfileModals";
import { User } from "../helpers/types";
import FamilyTreeView from "./FamilyTreeView";
import UserProfile from "./UserProfile";

interface MyDashboardProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function MyDashboard({ user, setUser }: MyDashboardProps) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const formik = useFormik({
    initialValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      date_of_birth: user.date_of_birth,
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleLogoutClick = () => {
    if (window.location.href.includes("localhost")) {
      window.location.href = "http://localhost:8000/logout";
    } else {
      window.location.href = "/logout";
    }
  };

  const handleSubmit = async (values: User) => {
    const newUser = await updateUser(values);
    if (newUser) {
      setUser({
        ...user,
        ...newUser,
      });
      toast({
        title: "Profile updated!",
        description: "Now look at you!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error!",
        description: "An error occurred while trying to update your profile.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  if (user)
    //otherwise, handle error
    return (
      <Flex direction="column" width="100%">
        <Flex p={2} direction="column">
          <Flex justifyContent="space-between">
            <Heading size="lg">Your Dashboard</Heading>
            <Button
              variant="outline"
              colorScheme="red"
              borderRadius="25px"
              leftIcon={<FaSignOutAlt />}
              onClick={handleLogoutClick}
            >
              Logout
            </Button>
          </Flex>
          <Text p={2}>✉️ {user.email}</Text>
        </Flex>
        <Tabs variant="enclosed" colorScheme="green">
          <TabList>
            <Tab>Public Profile</Tab>
            <Tab>Family Tree</Tab>
          </TabList>
          <TabPanels>
            <TabPanel p={2}>
              <Flex direction="column">
                <Flex justifyContent="end">
                  <Button
                    borderRadius="25px"
                    variant="outline"
                    colorScheme="green"
                    leftIcon={<FaGear />}
                    onClick={onOpen}
                  >
                    Edit Profile
                  </Button>
                </Flex>

                <Flex direction="column">
                  <UserProfile user={user} />
                </Flex>
              </Flex>
            </TabPanel>
            <TabPanel>
              <FamilyTreeView user={user} />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <ProfileModals isOpen={isOpen} onClose={onClose} formik={formik} />
      </Flex>
    );
}
