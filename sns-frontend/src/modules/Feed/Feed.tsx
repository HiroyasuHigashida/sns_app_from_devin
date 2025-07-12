/**
 * @fileoverview フィードコンポーネント
 * ホームページのメインコンテンツとして、投稿フォームと投稿一覧を表示します。
 * 投稿の取得・投稿機能をAPI連携して実装しています。
 */
import React, { useState } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { PostForm } from "@/modules/PostForm";
import { PostCard } from "@/modules/PostCard";
import { usePost } from "./api/usePost";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useGetPost } from "./api/useGetPost";
import { useLike, useUnlike } from "./api/useLike";
import { useUpdatePost, useDeletePost } from "./api/usePostActions";
import { PostEditDialog } from "@/modules/PostEditDialog";
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
 * @property {(page: string, username?: string) => void} [onAvatarClick] - アバタークリック時のコールバック
 */
export interface FeedProps {
  userAvatar?: string;
  initialPosts?: Array<{
    id: number;
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
  onAvatarClick?: (page: string, username?: string) => void;
}

/**
 * フィードコンポーネント
 * 投稿フォームと投稿一覧を表示し、投稿の作成や表示を管理します
 * 
 * @param {FeedProps} props - フィードコンポーネントのプロパティ
 * @returns {React.ReactElement} フィードコンポーネント
 */
export const Feed: React.FC<FeedProps> = ({ userAvatar, initialPosts = [], onAvatarClick }) => {
  // 認証ユーザー情報を取得
  const { user } = useAuthenticator((context) => [context.user]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<{id: number, content: string} | null>(null);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(20);

  // 投稿一覧を取得するカスタムフック
  const {
    data: posts = initialPosts,
    refetch: postRefetch,
  } = useGetPost(offset, limit);

  // 投稿を作成するカスタムフック（投稿後にフィードを再取得）
  const { mutate: post } = usePost(() => postRefetch());

  const { mutate: likePost } = useLike(() => postRefetch());
  const { mutate: unlikePost } = useUnlike(() => postRefetch());
  const { mutate: updatePost, isPending: updateLoading } = useUpdatePost(() => postRefetch());
  const { mutate: deletePost } = useDeletePost(() => postRefetch());

  /**
   * 投稿フォームからの送信時に呼ばれるハンドラ
   * 
   * @param {string} content - 投稿内容
   */
  const handlePostSubmit = async (content: string) => {
    console.log(user);
    post({
      content,
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

  const handleEdit = (postId: number, content: string) => {
    setEditingPost({ id: postId, content });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = (content: string) => {
    if (editingPost) {
      updatePost({ postId: editingPost.id, content });
      setEditDialogOpen(false);
      setEditingPost(null);
    }
  };

  const handleDelete = (postId: number) => {
    if (window.confirm('この投稿を削除しますか？')) {
      deletePost(postId);
    }
  };

  const handleLoadMore = () => {
    setOffset(prev => prev + limit);
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
              id={post.id}
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
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAvatarClick={onAvatarClick}
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
        {posts.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button onClick={handleLoadMore} variant="outlined">
              さらに読み込む
            </Button>
          </Box>
        )}
      </Box>

      <PostEditDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingPost(null);
        }}
        onSave={handleSaveEdit}
        initialContent={editingPost?.content || ''}
        loading={updateLoading}
      />
    </Paper>
  );
};
