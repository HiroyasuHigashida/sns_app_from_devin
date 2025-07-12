<template>
  <v-dialog
    :model-value="open"
    max-width="600px"
    persistent
    @update:model-value="onClose"
  >
    <v-card>
      <v-card-title>投稿を削除</v-card-title>
      
      <v-card-text>
        <p class="text-body-1">
          この投稿を削除しますか？この操作は取り消すことができません。
        </p>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer />
        <v-btn
          :disabled="loading"
          variant="text"
          @click="onClose"
        >
          キャンセル
        </v-btn>
        <v-btn
          :disabled="loading"
          variant="flat"
          color="error"
          @click="handleDelete"
        >
          {{ loading ? '削除中...' : '削除' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface PostDeleteDialogProps {
  open: boolean
  onClose: () => void
  onDelete: () => void
  loading?: boolean
}

const props = withDefaults(defineProps<PostDeleteDialogProps>(), {
  loading: false
})

const handleDelete = () => {
  props.onDelete()
}
</script>
