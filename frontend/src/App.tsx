import { Flex } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Albums from "./pages/Albums";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import Quotes from "./pages/Quotes";
import Resources from "./pages/Resources";
import Root from "./pages/Root";
import Users from "./pages/Users";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Flex margin="10px">
        <Routes>
          <Route path="/albums" element={<Albums />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/users" element={<Users />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/*" element={<Root />} />
        </Routes>
      </Flex>
    </BrowserRouter>
  );
}

export default App;
