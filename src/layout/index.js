import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { default as theme } from "../assets/styles/theme";
import Navbar from "../components/Navbar";
import Header from "./header/index";
import Sidebar from "./sidebar/index";
import Body from "./body/index";

Dashboard.propTypes = {
  children: PropTypes.element
};
export default function Dashboard({ children }) {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "130px"
            }}
          >
            <Navbar />
            <Header toggleDrawer={toggleDrawer} />
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              flex: "1"
            }}
          >
            <Sidebar open={open} />
            <Body>{children}</Body>
          </Box>
        </Box>
      </CssBaseline>
    </ThemeProvider>
  );
}
