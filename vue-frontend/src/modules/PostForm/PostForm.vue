<template>
  <v-card
    flat
    class="post-form"
  >
    <form @submit.prevent="handleSubmit">
      <div class="form-wrapper">
        <!-- ユーザーアバター -->
        <Avatar
          :src="userAvatar"
          alt="User"
        />
        
        <div class="content-wrapper">
          <!-- 投稿テキスト入力欄 -->
          <v-textarea
            v-model="content"
            placeholder="今どうしてる？"
            variant="plain"
            rows="3"
            auto-grow
            hide-details
            class="post-textarea"
          />
          
          <v-divider class="post-divider" />
          
          <div class="action-bar">
            <div class="actions-stack" />
            
            <div class="counter-wrapper">
              <!-- 文字数カウンター（入力がある場合のみ表示） -->
              <div
                v-if="content.length > 0"
                :class="['char-count', { 'over-limit': isOverLimit }]"
              >
                {{ charactersLeft }}
              </div>
              
              <!-- 投稿ボタン（空の場合または文字数超過時は無効） -->
              <Button
                variant="primary"
                size="small"
                type="submit"
                :disabled="content.length === 0 || isOverLimit"
              >
                ポスト
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Avatar from '@/components/Avatar/Avatar.vue'
import Button from '@/components/Button/Button.vue'

interface PostFormProps {
  userAvatar?: string
  onSubmit: (content: string) => void
  maxLength?: number
}

const props = withDefaults(defineProps<PostFormProps>(), {
  maxLength: 140
})

const content = ref("")

const handleSubmit = () => {
  if (content.value.trim() && content.value.length <= props.maxLength) {
    props.onSubmit(content.value)
    content.value = ""
  }
}

const charactersLeft = computed(() => props.maxLength - content.value.length)
const isOverLimit = computed(() => charactersLeft.value < 0)
</script>

<style scoped>
.post-form {
  padding: 16px;
}

.form-wrapper {
  display: flex;
  gap: 12px;
}

.content-wrapper {
  flex: 1;
  min-width: 0;
}

.post-textarea {
  font-size: 20px;
  line-height: 24px;
}

.post-textarea :deep(.v-field__input) {
  padding: 0;
  min-height: auto;
}

.post-textarea :deep(.v-field__field) {
  padding: 0;
}

.post-textarea :deep(.v-field__outline) {
  display: none;
}

.post-divider {
  margin: 12px 0;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions-stack {
  flex: 1;
}

.counter-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.char-count {
  font-size: 13px;
  color: rgb(83, 100, 113);
  font-weight: 400;
}

.char-count.over-limit {
  color: rgb(244, 33, 46);
}
</style>
