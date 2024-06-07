import { ChakraProvider } from "@chakra-ui/react";

import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
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
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
