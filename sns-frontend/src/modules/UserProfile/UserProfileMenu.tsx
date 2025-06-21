/**
 * @fileoverview ユーザープロフィールメニューコンポーネント
 * サイドナビゲーション下部に表示されるユーザー情報とドロップダウンメニューを提供します。
 * AWS Amplifyの認証機能と連携して、ユーザー情報の表示とログアウト機能を実装しています。
 */
import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { useAuthenticator } from "@aws-amplify/ui-react";
import {
  userProfileStyles,
  userBoxStyles,
  avatarStyles,
  userInfoStyles,
  usernameStyles,
  handleStyles,
  menuPaperStyles,
} from "./styles";

/**
 * ユーザープロフィールメニューコンポーネント
 * 現在ログイン中のユーザー情報を表示し、ログアウトなどのアクションを提供するメニューを含みます
 * 
 * @returns {React.ReactElement|null} ユーザープロフィールメニューコンポーネント（ユーザーが存在しない場合はnull）
 */
export const UserProfileMenu = () => {
  // AWS Amplifyの認証情報からユーザー情報とサインアウト機能を取得
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  // メニューの表示位置を管理するstate
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // メニューが開いているかどうかのフラグ
  const open = Boolean(anchorEl);

  /**
   * プロフィール部分クリック時のハンドラ
   * メニューを表示する位置（クリックされた要素）を設定します
   * 
   * @param {React.MouseEvent<HTMLElement>} event - クリックイベント
   */
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * メニューを閉じるハンドラ
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * ログアウト処理を行うハンドラ
   * メニューを閉じてからサインアウト処理を実行します
   */
  const handleLogout = () => {
    handleClose();
    signOut();
  };

  // ユーザーが存在しない場合は何も表示しない
  if (!user) return null;

  return (
    <Box sx={userProfileStyles}>
      {/* ユーザー情報表示部分 */}
      <Box sx={userBoxStyles} onClick={handleClick}>
        <Avatar alt={user.username || "ユーザー"} sx={avatarStyles}>
          <PersonIcon data-testid="PersonIcon" />
        </Avatar>
        <Box sx={userInfoStyles}>
          <Typography variant="body1" sx={usernameStyles}>
            {user.username || "ユーザー"}
          </Typography>
          <Typography variant="body2" sx={handleStyles}>
            @{user.username?.toLowerCase() || "user"}
          </Typography>
        </Box>
        <IconButton size="small">
          <MoreHorizOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* ドロップダウンメニュー */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: { sx: menuPaperStyles },
        }}
      >
        {/* ログアウトメニュー項目 */}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="ログアウト" />
        </MenuItem>
      </Menu>
    </Box>
  );
};
