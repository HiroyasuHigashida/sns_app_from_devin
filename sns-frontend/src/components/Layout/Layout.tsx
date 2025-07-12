import React from "react";
import {
  Box,
  CssBaseline,
  GlobalStyles,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { SideNav } from "@/modules/SideNav";
import {
  layoutStyles,
  sideNavStyles,
  feedStyles,
} from "./styles";
import { globalStyles } from "@/styles/global";

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const activePage = location.pathname === '/' ? 'home' : 'profile';
  
  const handleNavigate = (page: string, username?: string) => {
    if (page === "home") {
      navigate({ to: '/' });
    } else if (page === "profile" && username) {
      navigate({ to: '/profile/$username', params: { username } });
    }
  };

  return (
    <>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      <Box sx={layoutStyles}>
        {!isMobile && (
          <Box sx={sideNavStyles}>
            <SideNav activePage={activePage} onNavigate={handleNavigate} />
          </Box>
        )}

        <Box sx={feedStyles}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
};
