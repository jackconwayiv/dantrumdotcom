import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { fetchUserProfile } from "./api/users";
import Navbar from "./components/Navbar";
import { User } from "./helpers/types";
import AlbumsView from "./pages/AlbumsView";
import CalendarView from "./pages/CalendarView";
import TimelineView from "./pages/TimelineView";
import TimelineMyEventsView from "./pages/TimelineMyEventsView";
import FriendsDirectory from "./pages/FriendsDirectory";
import MyProfile from "./pages/MyDashboard";
import QuotesView from "./pages/QuotesView";
import ResourcesView from "./pages/ResourcesView";
import Root from "./pages/Root";
import FriendProfile from "./pages/UserProfile";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    const getUserProfile = async () => {
      const data = await fetchUserProfile();
      if (data) {
        setUser(data);
        setLoading(false);
      } else {
        const err = new Error("Failed to fetch user profile");
        console.error(err);
        setError(err);
        setLoading(false);
      }
    };

    getUserProfile();
  }, []);

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="100vh" bg="oasis.bg">
        <Spinner color="brand.500" size="lg" />
      </Flex>
    );
  }
  if (error) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="100vh" bg="oasis.bg" p={4}>
        <Text color="oasis.orange.600">Error: {JSON.stringify(error)}</Text>
      </Flex>
    );
  }

  if (user)
    return (
      <BrowserRouter>
        <Flex direction="column" width="100%" maxW="850px" minHeight="100vh">
          <Navbar user={user} />
          <Routes>
            <Route path="/app/" element={<Root user={user} />} />

            <Route path="/app/albums/" element={<AlbumsView user={user} />} />
            <Route path="/app/calendar/" element={<CalendarView />} />
            <Route path="/app/timeline/" element={<TimelineView user={user} />} />
            <Route
              path="/app/timeline/my-events/"
              element={<TimelineMyEventsView user={user} />}
            />
            <Route path="/app/quotes/" element={<QuotesView user={user} />} />
            <Route
              path="/app/resources/"
              element={<ResourcesView user={user} />}
            />
            <Route
              path="/app/friends/"
              element={<FriendsDirectory user={user} />}
            />
            <Route
              path="/app/friends/:id/"
              element={<FriendProfile user={user} />}
            />
            <Route
              path="/app/profile/"
              element={<MyProfile user={user} setUser={setUser} />}
            />
            <Route path="/" element={<Navigate to="/app" />} />
            <Route path="/*" element={<Navigate to="/app" />} />
          </Routes>
        </Flex>
      </BrowserRouter>
    );
}

export default App;
