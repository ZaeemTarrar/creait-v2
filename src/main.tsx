import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/index";
import ThemeProvider from "./theme/ThemeProvider";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
import App from "./App.tsx";
import { env } from "./utils/env/index.ts";
import "./index.css";

const Wrap = env.PROD ? (
  <StrictMode>
    <HashRouter basename="/">
      <Provider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
    </HashRouter>
  </StrictMode>
) : (
  <StrictMode>
    <BrowserRouter basename="/creait-v2">
      <Provider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);

createRoot(document.getElementById("root")!).render(Wrap);
