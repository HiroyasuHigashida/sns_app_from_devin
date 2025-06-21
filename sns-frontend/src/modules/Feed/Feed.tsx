/**
 * @fileoverview フィードコンポーネント
 * ホームページのメインコンテンツとして、投稿フォームと投稿一覧を表示します。
 * 投稿の取得・投稿機能をAPI連携して実装しています。
 */
import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { PostForm } from "@/modules/PostForm";
import { PostCard } from "@/modules/PostCard";
import { usePost } from "./api/usePost";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useGetPost } from "./api/useGetPost";
import { useLike, useUnlike } from "./api/useLike";
import {
  paperStyles,
  emptyStateStyles,
  emptyStateTextStyles,
} from "./styles";

/**
 * フィードコンポーネントのプロパティ定義
 * 
 * @interface FeedProps
 * @property {string} [userAvatar] - 投稿フォームに表示するユーザーアバター画像URL
 * @property {Array<PostData>} [initialPosts=[]] - 初期表示する投稿データ配列
 */
export interface FeedProps {
  userAvatar?: string;
  initialPosts?: Array<{
    id: string;
    username: string;
    handle: string;
    avatar: string;
    content: string;
    timestamp: string;
    likes: number;
    comments: number;
    retweets: number;
    isLiked: boolean;
  }>;
}

/**
 * フィードコンポーネント
 * 投稿フォームと投稿一覧を表示し、投稿の作成や表示を管理します
 * 
 * @param {FeedProps} props - フィードコンポーネントのプロパティ
 * @returns {React.ReactElement} フィードコンポーネント
 */
export const Feed: React.FC<FeedProps> = ({ userAvatar, initialPosts = [] }) => {
  // 認証ユーザー情報を取得
  const { user } = useAuthenticator((context) => [context.user]);
  // 投稿一覧を取得するカスタムフック
  const { refetch: postRefetch, data: posts = initialPosts } = useGetPost();

  // 投稿を作成するカスタムフック（投稿後にフィードを再取得）
  const { mutate: post } = usePost(() => postRefetch());

  const { mutate: likePost } = useLike(() => postRefetch());
  const { mutate: unlikePost } = useUnlike(() => postRefetch());

  /**
   * 投稿フォームからの送信時に呼ばれるハンドラ
   * 
   * @param {string} content - 投稿内容
   */
  const handlePostSubmit = async (content: string) => {
    console.log(user);
    post({
      content,
      user: user?.username,
    });
  };

  /**
   * いいねボタンクリック時のハンドラ
   */
  const handleLike = (postId: number, isLiked: boolean) => {
    if (isLiked) {
      unlikePost(postId);
    } else {
      likePost(postId);
    }
  };

  return (
    <Paper elevation={0} sx={paperStyles}>
      {/* 投稿フォーム */}
      <PostForm userAvatar={userAvatar} onSubmit={handlePostSubmit} />

      <Box>
        {posts.length > 0 ? (
          // 投稿がある場合は投稿一覧を表示
          posts.map((post) => (
            <PostCard
              key={post.id}
              username={post.username}
              handle={post.handle}
              avatar={post.avatar}
              content={post.content}
              timestamp={post.timestamp}
              likes={post.likes}
              comments={post.comments}
              retweets={post.retweets}
              isLiked={post.isLiked}
              onLike={() => handleLike(post.id, post.isLiked)}
              onComment={() => {}}
              onRetweet={() => {}}
              onShare={() => {}}
            />
          ))
        ) : (
          // 投稿がない場合は空の状態メッセージを表示
          <Box sx={emptyStateStyles}>
            <Typography variant="body1" sx={emptyStateTextStyles}>
              まだ投稿がありません。ポストを始めましょう！
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};
