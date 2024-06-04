import { Flex } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Albums from "./pages/Albums";
import Root from "./pages/Root";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Flex margin="10px">
        <Routes>
          <Route path="/albums" element={<Albums />} />
          <Route path="/*" element={<Root />} />
        </Routes>
      </Flex>
    </BrowserRouter>
  );
}

export default App;
