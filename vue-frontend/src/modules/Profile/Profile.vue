<template>
  <v-container class="profile-container">
    <v-card
      v-if="!user"
      class="pa-6"
    >
      <v-card-text>
        <v-text class="text-h6">
          ユーザーが見つかりません
        </v-text>
      </v-card-text>
    </v-card>

    <template v-else>
      <v-card
        elevation="1"
        class="pa-6 mb-6"
      >
        <div class="profile-header">
          <div class="avatar-section">
            <v-avatar
              size="120"
              class="profile-avatar"
            >
              <v-img
                v-if="iconData?.iconImage"
                :src="iconData.iconImage"
                :alt="username"
              />
              <v-icon
                v-else
                size="large"
              >
                mdi-account
              </v-icon>
            </v-avatar>
            
            <v-btn
              v-if="isOwnProfile"
              icon
              size="small"
              color="primary"
              class="avatar-edit-btn"
              @click="triggerFileInput"
            >
              <v-icon size="small">
                mdi-pencil
              </v-icon>
            </v-btn>
            
            <input
              v-if="isOwnProfile"
              ref="fileInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleIconUpload"
            >
          </div>
          
          <div class="profile-info">
            <v-text class="text-h5 font-weight-bold mb-1">
              {{ username }}
            </v-text>
            <v-text class="text-body-2 text-medium-emphasis mb-4">
              @{{ username.toLowerCase() }}
            </v-text>
            
            <div
              v-if="isEditing"
              class="edit-section"
            >
              <v-textarea
                v-model="editedProfile"
                placeholder="プロフィールを入力してください"
                variant="outlined"
                rows="3"
                class="mb-4"
              />
              <div class="edit-actions">
                <v-btn
                  variant="flat"
                  color="primary"
                  prepend-icon="mdi-content-save"
                  :loading="updateProfileMutation.isPending.value"
                  @click="handleSaveClick"
                >
                  保存
                </v-btn>
                <v-btn
                  variant="outlined"
                  prepend-icon="mdi-close"
                  class="ml-2"
                  @click="handleCancelClick"
                >
                  キャンセル
                </v-btn>
              </div>
            </div>
            
            <div
              v-else
              class="view-section"
            >
              <v-text class="text-body-1 mb-2">
                {{ profileData?.profile || "プロフィールが設定されていません" }}
              </v-text>
              <v-btn
                v-if="isOwnProfile"
                variant="outlined"
                prepend-icon="mdi-pencil"
                @click="handleEditClick"
              >
                プロフィールを編集
              </v-btn>
            </div>
          </div>
        </div>
      </v-card>

      <v-divider class="my-6" />

      <div class="posts-section">
        <v-text class="text-h6 mb-4">
          投稿 ({{ userPosts?.length || 0 }})
        </v-text>
        
        <template v-if="userPosts && userPosts.length > 0">
          <PostCard
            v-for="post in userPosts"
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
          />
        </template>
        
        <v-text
          v-else
          class="text-body-2 text-medium-emphasis"
        >
          まだ投稿がありません
        </v-text>
      </div>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PostCard from '@/modules/PostCard/PostCard.vue'
import { useCurrentUser } from '@/composables/useCurrentUser'
import { useGetProfile, useUpdateProfile, useGetIcon, useUpdateIcon } from '@/modules/UserProfile/api/useProfile'
import { useGetOwnerPosts } from '@/modules/Feed/api/useGetOwnerPosts'
import { useLike, useUnlike } from '@/modules/Feed/api/useLike'

interface ProfileProps {
  username?: string
}

const props = withDefaults(defineProps<ProfileProps>(), {})

const { user } = useCurrentUser()
const isEditing = ref(false)
const editedProfile = ref("")
const fileInput = ref<HTMLInputElement | null>(null)

const username = computed(() => props.username || user.value?.username || "")
const isOwnProfile = computed(() => !props.username || props.username === user.value?.username)

const { data: profileData, refetch: refetchProfile } = useGetProfile(username.value)
const { data: iconData, refetch: refetchIcon } = useGetIcon(username.value)
const { data: userPosts, refetch: refetchPosts } = useGetOwnerPosts(username.value)

const updateProfileMutation = useUpdateProfile(() => {
  refetchProfile()
  isEditing.value = false
})

const updateIconMutation = useUpdateIcon(() => {
  refetchIcon()
})

const { mutate: likePost } = useLike(() => refetchPosts())
const { mutate: unlikePost } = useUnlike(() => refetchPosts())

const handleEditClick = () => {
  editedProfile.value = profileData.value?.profile || ""
  isEditing.value = true
}

const handleSaveClick = () => {
  updateProfileMutation.mutate(editedProfile.value)
}

const handleCancelClick = () => {
  isEditing.value = false
  editedProfile.value = ""
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleIconUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64String = e.target?.result as string
      updateIconMutation.mutate(base64String)
    }
    reader.readAsDataURL(file)
  }
}

const handleLike = (postId: number, isLiked: boolean) => {
  if (isLiked) {
    unlikePost(postId)
  } else {
    likePost(postId)
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
}

.profile-header {
  display: flex;
  align-items: flex-start;
}

.avatar-section {
  position: relative;
  margin-right: 24px;
}

.profile-avatar {
  font-size: 3rem;
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.edit-section {
  margin-top: 16px;
}

.edit-actions {
  display: flex;
  gap: 8px;
}

.view-section {
  margin-top: 16px;
}

.posts-section {
  margin-top: 24px;
}
</style>
