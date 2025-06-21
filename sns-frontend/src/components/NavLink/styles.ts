import { SxProps, Theme } from "@mui/material";
import { NavLinkProps } from "./NavLink";

export const getNavLinkStyles = (
  props: Pick<NavLinkProps, "sx">,
): SxProps<Theme> => {
  return {
    display: "flex",
    alignItems: "center",
    gap: 2,
    py: 1.5,
    px: 2,
    borderRadius: "full",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgba(29, 155, 240, 0.1)",
    },
    ...props.sx,
  };
};

export const getNavLinkTypographyStyles = (
  isActive: boolean,
): SxProps<Theme> => {
  return {
    fontWeight: isActive ? "bold" : "normal",
    color: isActive ? "primary" : "inherit",
  };
};
