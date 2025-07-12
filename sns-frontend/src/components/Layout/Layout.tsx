import React from "react";
import {
  Box,
  CssBaseline,
  GlobalStyles,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { SideNav } from "../../modules/SideNav";
import {
  globalStyles,
  layoutStyles,
  sideNavStyles,
  feedStyles,
} from "./styles";

interface LayoutProps {
  children: React.ReactNode;
  activePage: "home" | "profile";
  onNavigate: (page: string, username?: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  activePage,
  onNavigate,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      <Box sx={layoutStyles}>
        {!isMobile && (
          <Box sx={sideNavStyles}>
            <SideNav activePage={activePage} onNavigate={onNavigate} />
          </Box>
        )}

        <Box sx={feedStyles}>
          {children}
        </Box>
      </Box>
    </>
  );
};
