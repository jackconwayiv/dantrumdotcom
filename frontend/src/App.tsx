import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { fetchUserProfile } from "./api/users";
import Navbar from "./components/Navbar";
import { User } from "./helpers/types";
import AlbumsView from "./pages/AlbumsView";
import CalendarView from "./pages/CalendarView";
import FriendProfile from "./pages/FriendProfile";
import FriendsDirectory from "./pages/FriendsDirectory";
import MyProfile from "./pages/MyProfile";
import QuotesView from "./pages/QuotesView";
import ResourcesView from "./pages/ResourcesView";
import Root from "./pages/Root";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setUser(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    getUserProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;

  if (user)
    return (
      <BrowserRouter>
        <Flex
          direction="column"
          width="100%"
          maxW="850px"
          minHeight="100vh"
          m={2}
          p={2}
        >
          <Navbar user={user} />
          <Routes>
            <Route path="/app/" element={<Root />} />

            <Route path="/app/albums/" element={<AlbumsView user={user} />} />
            <Route path="/app/calendar/" element={<CalendarView />} />
            <Route path="/app/quotes/" element={<QuotesView user={user} />} />
            <Route
              path="/app/resources/"
              element={<ResourcesView user={user} />}
            />
            <Route path="/app/friends/" element={<FriendsDirectory />} />
            <Route path="/app/friends/:id/" element={<FriendProfile />} />
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
