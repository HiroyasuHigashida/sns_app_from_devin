import React from "react";
import {
  Box,
  CssBaseline,
  GlobalStyles,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { SideNav } from "@/modules/SideNav";
import {
  layoutStyles,
  sideNavStyles,
  feedStyles,
} from "./styles";
import { globalStyles } from "@/styles/global";

interface LayoutProps {
  activePage: "home" | "profile";
  onNavigate: (page: string, username?: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ activePage, onNavigate, children }) => {
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
