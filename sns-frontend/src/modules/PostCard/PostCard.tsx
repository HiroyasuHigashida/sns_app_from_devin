/**
 * @fileoverview 投稿カードコンポーネント
 * フィード内の各投稿を表示するカードコンポーネントです。
 * ユーザー情報、投稿内容、エンゲージメント（いいね、コメント、リツイート、シェア）機能を提供します。
 */
import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import ShareIcon from "@mui/icons-material/Share";
import { Avatar } from "@/components/Avatar";
import {
  cardStyles,
  cardContentStyles,
  cardWrapperStyles,
  contentWrapperStyles,
  headerStyles,
  usernameStyles,
  secondaryTextStyles,
  contentStyles,
  cardActionsStyles,
  actionItemStyles,
  getLikeButtonStyles,
} from "./styles";

/**
 * 投稿カードのプロパティ定義
 * 
 * @interface PostCardProps
 * @property {string} username - 投稿者のユーザー名
 * @property {string} handle - 投稿者のハンドル名（@名）
 * @property {string} [avatar] - 投稿者のアバター画像URL
 * @property {string} content - 投稿内容
 * @property {string} timestamp - 投稿日時
 * @property {number} likes - いいね数
 * @property {number} comments - コメント数
 * @property {number} retweets - リツイート数
 * @property {boolean} [isLiked=false] - 現在のユーザーがいいねしているかどうか
 * @property {() => void} [onLike] - いいねボタン押下時のコールバック
 * @property {() => void} [onComment] - コメントボタン押下時のコールバック
 * @property {() => void} [onRetweet] - リツイートボタン押下時のコールバック
 * @property {() => void} [onShare] - シェアボタン押下時のコールバック
 */
export interface PostCardProps {
  username: string;
  handle: string;
  avatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  retweets: number;
  isLiked?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onRetweet?: () => void;
  onShare?: () => void;
}

/**
 * 投稿カードコンポーネント
 * ユーザー情報、投稿内容、各種アクションボタンを含む投稿カードを表示します
 * 
 * @param {PostCardProps} props - 投稿カードのプロパティ
 * @returns {React.ReactElement} 投稿カードコンポーネント
 */
export const PostCard: React.FC<PostCardProps> = ({
  username,
  handle,
  avatar,
  content,
  timestamp,
  likes,
  comments,
  retweets,
  isLiked = false,
  onLike,
  onComment,
  onRetweet,
  onShare,
}) => {
  return (
    <Card sx={cardStyles}>
      <CardContent sx={cardContentStyles}>
        <Box sx={cardWrapperStyles}>
          {/* 投稿者のアバター */}
          <Avatar src={avatar} alt={username} size="medium" />
          <Box sx={contentWrapperStyles}>
            {/* 投稿ヘッダー（ユーザー情報、日時） */}
            <Box sx={headerStyles}>
              <Typography variant="subtitle1" sx={usernameStyles}>
                {username}
              </Typography>
              <Typography variant="body2" sx={secondaryTextStyles}>
                @{handle}
              </Typography>
              <Typography variant="body2" sx={secondaryTextStyles}>
                ・
              </Typography>
              <Typography variant="body2" sx={secondaryTextStyles}>
                {timestamp}
              </Typography>
            </Box>
            {/* 投稿内容 */}
            <Typography variant="body1" sx={contentStyles}>
              {content}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      {/* 投稿アクションボタン */}
      <CardActions sx={cardActionsStyles}>
        {/* コメントボタン */}
        <Box sx={actionItemStyles}>
          <IconButton size="small" onClick={onComment} aria-label="comment">
            <ChatBubbleOutlineIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" sx={secondaryTextStyles}>
            {comments}
          </Typography>
        </Box>
        {/* リツイートボタン */}
        <Box sx={actionItemStyles}>
          <IconButton size="small" onClick={onRetweet} aria-label="retweet">
            <RepeatIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" sx={secondaryTextStyles}>
            {retweets}
          </Typography>
        </Box>
        {/* いいねボタン（いいね済みかどうかで見た目を変更） */}
        <Box sx={actionItemStyles}>
          <IconButton
            size="small"
            onClick={onLike}
            sx={getLikeButtonStyles(isLiked)}
            aria-label="like"
          >
            {isLiked ? (
              <FavoriteIcon fontSize="small" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
          </IconButton>
          <Typography variant="body2" sx={secondaryTextStyles}>
            {likes}
          </Typography>
        </Box>
        {/* シェアボタン */}
        <IconButton size="small" onClick={onShare} aria-label="share">
          <ShareIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
};
