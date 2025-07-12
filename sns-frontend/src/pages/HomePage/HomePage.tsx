/**
 * @fileoverview ホームページコンポーネント
 * アプリケーションのメインページで、サイドナビゲーションとフィードを含むレイアウトを提供します。
 * レスポンシブデザインに対応しており、モバイル表示時にはサイドナビゲーションを非表示にします。
 */
import React, { useState } from "react";
import {
  Box,
  useMediaQuery,
  useTheme,
  CssBaseline,
  GlobalStyles,
} from "@mui/material";
import { SideNav } from "@/modules/SideNav";
import { Feed } from "@/modules/Feed";
import { Profile } from "@/modules/Profile";
import {
  globalStyles,
  layoutStyles,
  sideNavStyles,
  feedStyles,
} from "./styles";

/**
 * ホームページコンポーネント
 * アプリケーションのメインレイアウトを構成し、サイドナビゲーションとフィードを表示します
 * レスポンシブ対応：モバイルビューではサイドナビゲーションを非表示にします
 * 
 * @returns {React.ReactElement} ホームページコンポーネント
 */
export const HomePage: React.FC = () => {
  const theme = useTheme();
  // モバイル表示かどうかを判定するメディアクエリ
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activePage, setActivePage] = useState<"home" | "profile">("home");

  const handleNavigate = (page: string) => {
    if (page === "home" || page === "profile") {
      setActivePage(page);
    }
  };

  return (
    <>
      {/* Material UIのリセットCSSを適用 */}
      <CssBaseline />
      {/* グローバルスタイルの適用 */}
      <GlobalStyles styles={globalStyles} />
      <Box sx={layoutStyles}>
        {/* 左サイドバー - ナビゲーション (モバイル表示では非表示) */}
        {!isMobile && (
          <Box sx={sideNavStyles}>
            <SideNav activePage={activePage} onNavigate={handleNavigate} />
          </Box>
        )}

        {/* メインコンテンツ - フィードまたはプロフィール */}
        <Box sx={feedStyles}>
          {activePage === "profile" ? <Profile /> : <Feed />}
        </Box>
      </Box>
    </>
  );
};
