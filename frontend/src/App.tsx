import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { fetchUserProfile } from "./api/user";
import Navbar from "./components/Navbar";
import Albums from "./pages/Albums";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import Quotes from "./pages/Quotes";
import Resources from "./pages/Resources";
import Root from "./pages/Root";
import Users from "./pages/Users";

function App() {
  const [user, setUser] = useState(null);
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
            <Route path="/albums" element={<Albums />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/users" element={<Users />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/*" element={<Root />} />
          </Routes>
        </Flex>
      </BrowserRouter>
    );
}

export default App;
