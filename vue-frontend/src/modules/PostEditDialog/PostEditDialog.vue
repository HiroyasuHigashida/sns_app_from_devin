<template>
  <v-dialog
    :model-value="open"
    max-width="600px"
    persistent
    @update:model-value="handleClose"
  >
    <v-card>
      <v-card-title>投稿を編集</v-card-title>
      
      <v-card-text>
        <v-textarea
          v-model="content"
          placeholder="いまどうしてる？"
          variant="outlined"
          rows="4"
          auto-grow
          autofocus
          class="mt-2"
        />
        
        <div class="char-counter">
          <span :class="{ 'text-error': content.length > maxLength }">
            {{ content.length }}/{{ maxLength }}
          </span>
        </div>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer />
        <v-btn
          :disabled="loading"
          variant="text"
          @click="handleClose"
        >
          キャンセル
        </v-btn>
        <v-btn
          :disabled="!content.trim() || content.length > maxLength || loading"
          variant="flat"
          color="primary"
          @click="handleSave"
        >
          {{ loading ? '保存中...' : '保存' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface PostEditDialogProps {
  open: boolean
  onClose: () => void
  onSave: (content: string) => void
  initialContent: string
  loading?: boolean
}

const props = withDefaults(defineProps<PostEditDialogProps>(), {
  loading: false
})

const content = ref(props.initialContent)
const maxLength = 140

watch(() => props.initialContent, (newContent) => {
  content.value = newContent
})

const handleSave = () => {
  if (content.value.trim() && content.value.length <= maxLength) {
    props.onSave(content.value.trim())
  }
}

const handleClose = () => {
  content.value = props.initialContent
  props.onClose()
}
</script>

<style scoped>
.char-counter {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.text-error {
  color: rgb(244, 67, 54);
}
</style>
