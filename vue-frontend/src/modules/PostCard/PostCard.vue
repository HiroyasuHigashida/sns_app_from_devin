<template>
  <v-card
    flat
    class="post-card"
  >
    <v-card-text class="post-content">
      <div class="card-wrapper">
        <!-- 投稿者のアバター -->
        <Avatar 
          :src="avatar" 
          :alt="username" 
          size="medium" 
          @click="() => onAvatarClick?.('profile', username)"
        />
        
        <div class="content-wrapper">
          <!-- 投稿ヘッダー（ユーザー情報、日時） -->
          <div class="header">
            <span class="username">{{ username }}</span>
            <span class="secondary-text">@{{ handle }}</span>
            <span class="secondary-text">・</span>
            <span class="secondary-text">{{ timestamp }}</span>
            
            <v-menu
              v-if="isOwner(username)"
              v-model="menuOpen"
              location="bottom end"
            >
              <template #activator="{ props }">
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  v-bind="props"
                  class="menu-button"
                >
                  <v-icon size="small">
                    mdi-dots-horizontal
                  </v-icon>
                </v-btn>
              </template>
              
              <v-list>
                <v-list-item @click="handleEdit">
                  <template #prepend>
                    <v-icon>mdi-pencil</v-icon>
                  </template>
                  <v-list-item-title>編集</v-list-item-title>
                </v-list-item>
                <v-list-item @click="handleDelete">
                  <template #prepend>
                    <v-icon>mdi-delete</v-icon>
                  </template>
                  <v-list-item-title>削除</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
          
          <!-- 投稿内容 -->
          <div class="content">
            {{ content }}
          </div>
        </div>
      </div>
    </v-card-text>
    
    <!-- 投稿アクションボタン -->
    <v-card-actions class="card-actions">
      <!-- コメントボタン -->
      <div class="action-item">
        <v-btn
          icon
          size="small"
          variant="text"
          aria-label="comment"
          @click="onComment"
        >
          <v-icon size="small">
            mdi-comment-outline
          </v-icon>
        </v-btn>
        <span class="secondary-text">{{ comments }}</span>
      </div>
      
      <!-- リツイートボタン -->
      <div class="action-item">
        <v-btn
          icon
          size="small"
          variant="text"
          aria-label="retweet"
          @click="onRetweet"
        >
          <v-icon size="small">
            mdi-repeat
          </v-icon>
        </v-btn>
        <span class="secondary-text">{{ retweets }}</span>
      </div>
      
      <!-- いいねボタン（いいね済みかどうかで見た目を変更） -->
      <div class="action-item">
        <v-btn
          icon
          size="small"
          variant="text"
          :class="{ 'like-button-active': isLiked }"
          aria-label="like"
          @click="onLike"
        >
          <v-icon
            size="small"
            :color="isLiked ? 'red' : undefined"
          >
            {{ isLiked ? 'mdi-heart' : 'mdi-heart-outline' }}
          </v-icon>
        </v-btn>
        <span class="secondary-text">{{ likes }}</span>
      </div>
      
      <!-- シェアボタン -->
      <v-btn
        icon
        size="small"
        variant="text"
        aria-label="share"
        @click="onShare"
      >
        <v-icon size="small">
          mdi-share
        </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Avatar from '@/components/Avatar/Avatar.vue'
import { useCurrentUser } from '@/composables/useCurrentUser'

interface PostCardProps {
  id: number
  username: string
  handle: string
  avatar?: string
  content: string
  timestamp: string
  likes: number
  comments: number
  retweets: number
  isLiked?: boolean
  onLike?: () => void
  onComment?: () => void
  onRetweet?: () => void
  onShare?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onAvatarClick?: () => void
}

const props = withDefaults(defineProps<PostCardProps>(), {
  isLiked: false
})

const { isOwner } = useCurrentUser()
const menuOpen = ref(false)

const handleEdit = () => {
  menuOpen.value = false
  props.onEdit?.(props.id, props.content)
}

const handleDelete = () => {
  menuOpen.value = false
  props.onDelete?.(props.id)
}
</script>

<style scoped>
.post-card {
  border-bottom: 1px solid #eaeaea;
}

.post-content {
  padding: 12px 16px;
}

.card-wrapper {
  display: flex;
  gap: 12px;
}

.content-wrapper {
  flex: 1;
  min-width: 0;
}

.header {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
}

.username {
  font-weight: 700;
  font-size: 15px;
  line-height: 20px;
  color: rgb(15, 20, 25);
}

.secondary-text {
  color: rgb(83, 100, 113);
  font-size: 15px;
  line-height: 20px;
}

.content {
  font-size: 15px;
  line-height: 20px;
  color: rgb(15, 20, 25);
  white-space: pre-wrap;
  word-wrap: break-word;
}

.menu-button {
  margin-left: auto;
}

.card-actions {
  padding: 0 16px 12px 16px;
  justify-content: space-between;
  max-width: 425px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.like-button-active {
  color: rgb(249, 24, 128);
}
</style>
