import { SxProps, Theme } from "@mui/material";

export const paperStyles: SxProps<Theme> = {
  height: "100vh",
  borderRight: "1px solid #eaeaea",
  position: "sticky",
  top: 0,
  p: 2,
  display: "flex",
  flexDirection: "column",
};

export const logoStyles: SxProps<Theme> = {
  mb: 2,
};

export const navListStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  gap: 1,
};

export const postButtonStyles: SxProps<Theme> = {
  mt: 2,
  mb: "auto",
}; 