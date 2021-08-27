import { Grid, Box, ThemeProvider } from "theme-ui";
import customTheme from "../theme";
import Welcome from "./welcome";

export default () => (
  <ThemeProvider theme={customTheme}>
    <Welcome />
  </ThemeProvider>
);
