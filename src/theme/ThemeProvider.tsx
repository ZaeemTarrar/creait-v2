import React from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { Global } from "@emotion/react";
import theme from "./theme";
import { globalStyles } from "./globalStyles";
import FontLoader from "./FontLoader";

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <>
      <FontLoader />
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Global styles={globalStyles} />
        {children}
      </MuiThemeProvider>
    </>
  );
};

export default ThemeProvider;
