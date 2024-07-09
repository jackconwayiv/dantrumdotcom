import { ChakraProvider, Flex } from "@chakra-ui/react";

import * as Sentry from "@sentry/react";
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

Sentry.init({
  dsn: "https://5a30aea0762860419010f56f253c56a7@o4507573329199104.ingest.us.sentry.io/4507573748957184",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

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
