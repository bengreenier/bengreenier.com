import { Grid, Box, ThemeUIProvider } from "theme-ui";
import { customTheme } from "../theme";
import Welcome from "./welcome";

export default function App() {
  return (
    <ThemeUIProvider theme={customTheme}>
      <Welcome />
    </ThemeUIProvider>
  );
}
