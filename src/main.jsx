import React from "react";
import ReactDOM from "react-dom";
import { AmplifyProvider } from "@aws-amplify/ui-react";

import App from "./App";

import "@aws-amplify/ui-react/styles.css";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <AmplifyProvider colorMode="system">
      <App />
    </AmplifyProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
