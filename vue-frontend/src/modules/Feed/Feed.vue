<template>
  <v-card
    flat
    class="feed-container"
    data-testid="feed-container"
  >
    <!-- 投稿フォーム -->
    <PostForm
      :user-avatar="userAvatar"
      @submit="handlePostSubmit"
    />

    <div>
      <template v-if="allPosts.length > 0">
        <!-- 投稿がある場合は投稿一覧を表示 -->
        <PostCard
          v-for="post in allPosts"
          :id="post.id"
          :key="post.id"
          :username="post.username"
          :handle="post.handle"
          :avatar="post.avatar"
          :content="post.content"
          :timestamp="post.timestamp"
          :likes="post.likes"
          :comments="post.comments"
          :retweets="post.retweets"
          :is-liked="post.isLiked"
          @like="() => handleLike(post.id, post.isLiked)"
          @comment="() => {}"
          @retweet="() => {}"
          @share="() => {}"
          @edit="handleEdit"
          @delete="handleDelete"
          @avatar-click="onAvatarClick"
        />
      </template>
      
      <template v-else>
        <!-- 投稿がない場合は空の状態メッセージを表示 -->
        <div class="empty-state">
          <div class="empty-state-text">
            まだ投稿がありません。ポストを始めましょう！
          </div>
        </div>
      </template>
      
      <div
        v-if="allPosts.length > 0"
        class="load-more-container"
      >
        <v-btn
          variant="outlined"
          @click="handleLoadMore"
        >
          さらに読み込む
        </v-btn>
      </div>
    </div>

    <PostEditDialog
      :open="editDialogOpen"
      :initial-content="editingPost?.content || ''"
      :loading="updateLoading"
      @close="() => {
        editDialogOpen = false;
        editingPost = null;
      }"
      @save="handleSaveEdit"
    />

    <PostDeleteDialog
      :open="deleteDialogOpen"
      :loading="false"
      @close="() => {
        deleteDialogOpen = false;
        deletingPostId = null;
      }"
      @delete="() => {
        if (deletingPostId) {
          deletePost(deletingPostId);
          deleteDialogOpen = false;
          deletingPostId = null;
        }
      }"
    />
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import PostForm from '@/modules/PostForm/PostForm.vue'
import PostCard from '@/modules/PostCard/PostCard.vue'
import PostEditDialog from '@/modules/PostEditDialog/PostEditDialog.vue'
import PostDeleteDialog from '@/modules/PostDeleteDialog/PostDeleteDialog.vue'
import { usePost } from './api/usePost'
import { useGetPost } from './api/useGetPost'
import { useLike, useUnlike } from './api/useLike'
import { useUpdatePost, useDeletePost } from './api/usePostActions'
import { useCurrentUser } from '@/composables/useCurrentUser'

interface PostData {
  id: number
  username: string
  handle: string
  avatar: string
  content: string
  timestamp: string
  likes: number
  comments: number
  retweets: number
  isLiked: boolean
}

interface FeedProps {
  userAvatar?: string
  initialPosts?: PostData[]
  onAvatarClick?: () => void
}

const props = withDefaults(defineProps<FeedProps>(), {
  initialPosts: () => []
})

// 認証ユーザー情報を取得
const { user } = useCurrentUser()

const editDialogOpen = ref(false)
const editingPost = ref<{id: number, content: string} | null>(null)
const deleteDialogOpen = ref(false)
const deletingPostId = ref<number | null>(null)
const offset = ref(0)
const limit = ref(20)
const allPosts = ref<PostData[]>(props.initialPosts)

// 投稿一覧を取得するカスタムフック
const {
  data: newPosts,
  refetch: postRefetch,
} = useGetPost(offset.value, limit.value)

watch([newPosts, offset], ([posts, currentOffset]) => {
  if (posts && posts.length > 0) {
    if (currentOffset === 0) {
      allPosts.value = posts
    } else {
      allPosts.value = [...allPosts.value, ...posts]
    }
  }
})

// 投稿を作成するカスタムフック（投稿後にフィードを再取得）
const { mutate: post } = usePost(() => {
  offset.value = 0
  postRefetch()
})

const { mutate: likePost } = useLike(() => postRefetch())
const { mutate: unlikePost } = useUnlike(() => postRefetch())
const { mutate: updatePost, isPending: updateLoading } = useUpdatePost(() => postRefetch())
const { mutate: deletePost } = useDeletePost(() => {
  offset.value = 0
  postRefetch()
})

/**
 * 投稿フォームからの送信時に呼ばれるハンドラ
 */
const handlePostSubmit = async (content: string) => {
  console.log(user.value)
  post({
    content,
  })
}

/**
 * いいねボタンクリック時のハンドラ
 */
const handleLike = (postId: number, isLiked: boolean) => {
  if (isLiked) {
    unlikePost(postId)
  } else {
    likePost(postId)
  }
}

const handleEdit = (postId: number, content: string) => {
  editingPost.value = { id: postId, content }
  editDialogOpen.value = true
}

const handleSaveEdit = (content: string) => {
  if (editingPost.value) {
    updatePost({ postId: editingPost.value.id, content })
    editDialogOpen.value = false
    editingPost.value = null
  }
}

const handleDelete = (postId: number) => {
  deletingPostId.value = postId
  deleteDialogOpen.value = true
}

const handleLoadMore = () => {
  offset.value = offset.value + limit.value
}
</script>

<style scoped>
.feed-container {
  background-color: white;
  border: none;
  box-shadow: none;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px 16px;
}

.empty-state-text {
  color: rgb(83, 100, 113);
  font-size: 15px;
  line-height: 20px;
}

.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
