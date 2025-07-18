/**
 * @fileoverview サイドナビゲーションコンポーネント
 * アプリケーションの左側に表示されるナビゲーションバーで、各ページへのリンクと
 * ユーザープロフィールメニューを含みます。
 */
import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HomeIcon from "@mui/icons-material/Home";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PersonIcon from "@mui/icons-material/Person";
import { NavLink } from "@/components/NavLink";
import { UserProfileMenu } from "@/modules/UserProfile";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { paperStyles, logoStyles, navListStyles } from "./styles";

/**
 * サイドナビゲーションのプロパティ定義
 * 
 * @interface SideNavProps
 * @property {("home"|"explore"|"notifications"|"messages"|"bookmarks"|"profile")} [activePage="home"] - 現在アクティブなページ
 * @property {(page: string) => void} [onNavigate] - ページ遷移時のコールバック関数
 */
export interface SideNavProps {
  activePage?:
    | "home"
    | "explore"
    | "notifications"
    | "messages"
    | "bookmarks"
    | "profile";
  onNavigate?: (page: string, username?: string) => void;
}

/**
 * サイドナビゲーションコンポーネント
 * アプリケーションの主要なナビゲーション要素を提供し、現在のアクティブページを視覚的に示します
 * 
 * @param {SideNavProps} props - サイドナビゲーションのプロパティ
 * @returns {React.ReactElement} サイドナビゲーションコンポーネント
 */
export const SideNav: React.FC<SideNavProps> = ({
  activePage = "home",
  onNavigate,
}) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const username = user?.username;
  
  console.log('SideNav user object:', user);
  console.log('SideNav username:', username);
  
  /**
   * ナビゲーションリンククリック時のハンドラ
   * onNavigateプロパティが提供されている場合にそれを呼び出します
   * 
   * @param {string} page - 遷移先のページ名
   */
  const handleNavigate = (page: string) => {
    console.log('SideNav handleNavigate called with:', page, 'username:', username);
    if (onNavigate) {
      if (page === "profile") {
        onNavigate(page, username || "");
      } else {
        onNavigate(page);
      }
    }
  };

  return (
    <Paper elevation={0} sx={paperStyles}>
      {/* アプリケーションロゴ */}
      <Box sx={logoStyles}>
        <Typography variant="h4">K</Typography>
      </Box>

      {/* ナビゲーションリンクリスト */}
      <Box sx={navListStyles}>
        <NavLink
          icon={<HomeOutlinedIcon fontSize="large" />}
          activeIcon={<HomeIcon fontSize="large" />}
          label="ホーム"
          isActive={activePage === "home"}
          onClick={() => handleNavigate("home")}
        />
        <NavLink
          icon={<PersonOutlinedIcon fontSize="large" />}
          activeIcon={<PersonIcon fontSize="large" />}
          label="プロフィール"
          isActive={activePage === "profile"}
          onClick={() => handleNavigate("profile")}
        />
      </Box>

      {/* ユーザープロフィールメニュー */}
      <UserProfileMenu />
    </Paper>
  );
};
