import { ChakraProvider, Flex } from "@chakra-ui/react";

import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./Scroll.css";
import { handleFailedRequest } from "./helpers/session";

axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";

// Add a response interceptor
axios.interceptors.response.use(undefined, handleFailedRequest);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <Flex
        direction="row"
        justifyContent="center"
        bgColor="silver"
        height="100%"
        width="100vw"
      >
        <Flex
          direction="column"
          width="100%"
          height="100%"
          maxWidth="850px"
          bgColor="white"
        >
          <App />
        </Flex>
      </Flex>
    </ChakraProvider>
  </React.StrictMode>
);
