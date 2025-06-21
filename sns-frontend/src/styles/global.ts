// グローバルスタイル
export const globalStyles = {
  // index.cssから移動したスタイル
  ":root": {
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
    lineHeight: 1.5,
    fontWeight: 400,
    colorScheme: "light dark",
    color: "rgba(255, 255, 255, 0.87)",
    backgroundColor: "#242424",
    fontSynthesis: "none",
    textRendering: "optimizeLegibility",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  },

  // アウトラインとフォーカス表示を完全に削除
  "*": {
    outline: "none !important",
  },

  "*:focus": {
    outline: "none !important",
    boxShadow: "none !important",
  },

  "*:focus-visible": {
    outline: "none !important",
    boxShadow: "none !important",
  },

  a: {
    fontWeight: 500,
    color: "#646cff",
    textDecoration: "inherit",
  },
  "a:hover": {
    color: "#535bf2",
  },

  body: {
    margin: 0,
    padding: 0,
    display: "block",
    minWidth: "320px",
    minHeight: "100vh",
  },

  h1: {
    fontSize: "3.2em",
    lineHeight: 1.1,
  },

  button: {
    borderRadius: "8px",
    border: "1px solid transparent",
    padding: "0.6em 1.2em",
    fontSize: "1em",
    fontWeight: 500,
    fontFamily: "inherit",
    backgroundColor: "#1a1a1a",
    cursor: "pointer",
    transition: "border-color 0.25s",
  },
  "button:hover": {
    borderColor: "#646cff",
  },
  "button:focus, button:focus-visible": {
    outline: "none !important",
    boxShadow: "none !important",
  },

  "@media (prefers-color-scheme: light)": {
    ":root": {
      color: "#213547",
      backgroundColor: "#ffffff",
    },
    "a:hover": {
      color: "#747bff",
    },
    button: {
      backgroundColor: "#f9f9f9",
    },
  },

  // App.cssから移動したスタイル
  "#root": {
    width: "100%",
    height: "100%",
    margin: 0,
    padding: 0,
    textAlign: "left",
  },

  // 不要なスタイルを削除または無効化
  ".logo, .card, .read-the-docs": {
    display: "none",
  },
};
