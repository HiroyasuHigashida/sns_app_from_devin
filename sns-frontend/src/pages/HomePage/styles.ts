import { createTheme, SxProps, Theme } from "@mui/material";

// Darkテーマ
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1d9bf0", // Twitter blue
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    // フォーカス表示を削除
    MuiCssBaseline: {
      styleOverrides: {
        "& *:focus": {
          outline: "none !important",
          boxShadow: "none !important",
        },
        "& .MuiButtonBase-root:focus": {
          outline: "none !important",
          boxShadow: "none !important",
        },
      },
    },
  },
});

// Lightテーマ
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1d9bf0", // Twitter blue
    },
    background: {
      default: "#fff",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    // フォーカス表示を削除
    MuiCssBaseline: {
      styleOverrides: {
        "& *:focus": {
          outline: "none !important",
          boxShadow: "none !important",
        },
        "& .MuiButtonBase-root:focus": {
          outline: "none !important",
          boxShadow: "none !important",
        },
      },
    },
  },
});

// グローバルスタイル
export const globalStyles = {
  "html, body, #root": {
    height: "100%",
    margin: 0,
    padding: 0,
    overflow: "hidden",
  },
  "*:focus, *:focus-visible, *:active": {
    outline: "none !important",
    boxShadow: "none !important",
  },
  'button:focus, [role="button"]:focus, a:focus, .MuiButtonBase-root:focus': {
    outline: "none !important",
    boxShadow: "none !important",
  },
};

// レイアウトスタイル
export const layoutStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  height: "100vh",
  width: "100%",
  overflow: "hidden",
  position: "absolute",
  top: 0,
  left: 0,
  justifyContent: "center",
};

// サイドナビゲーションスタイル
export const sideNavStyles: SxProps<Theme> = {
  width: { md: "240px", lg: "275px" },
  flexShrink: 0,
  height: "100vh",
  overflow: "auto",
  position: "fixed",
  left: 0,
  top: 0,
  zIndex: 10,
};

// フィードスタイル
export const feedStyles: SxProps<Theme> = {
  width: "100%",
  maxWidth: "600px",
  borderLeft: "1px solid #eaeaea",
  borderRight: "1px solid #eaeaea",
  height: "100vh",
  overflow: "auto",
};

// トレンドサイドバースタイル
export const trendSidebarStyles: SxProps<Theme> = {
  width: { lg: "350px" },
  flexShrink: 0,
  height: "100vh",
  overflow: "auto",
  position: "fixed",
  right: 0,
  top: 0,
  zIndex: 10,
};
