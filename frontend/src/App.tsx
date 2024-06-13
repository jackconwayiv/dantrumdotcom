import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
        <Navbar user={user} />
        <Flex margin="10px">
          <Routes>
            <Route path="/albums" element={<AlbumsView user={user} />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/quotes" element={<QuotesView user={user} />} />
            <Route path="/resources" element={<ResourcesView />} />
            <Route path="/friends" element={<FriendsDirectory />} />
            <Route path="/friends/:id" element={<FriendProfile />} />
            <Route
              path="/profile"
              element={<MyProfile user={user} setUser={setUser} />}
            />
            <Route path="/" element={<Root />} />
          </Routes>
        </Flex>
      </BrowserRouter>
    );
}

export default App;
