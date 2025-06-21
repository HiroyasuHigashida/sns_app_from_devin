import { SxProps, Theme } from "@mui/material";

export const userProfileStyles: SxProps<Theme> = {
  mt: 2,
  mb: 2,
};

export const userBoxStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  p: 1,
  borderRadius: 2,
  cursor: "pointer",
  "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
};

export const avatarStyles: SxProps<Theme> = {
  width: 40,
  height: 40,
  mr: 1.5,
};

export const userInfoStyles: SxProps<Theme> = {
  flex: 1,
  overflow: "hidden",
};

export const usernameStyles: SxProps<Theme> = {
  fontWeight: "bold",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export const handleStyles: SxProps<Theme> = {
  color: "text.secondary",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export const menuPaperStyles: SxProps<Theme> = {
  width: 240,
  mt: 1,
  boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.2)",
};
