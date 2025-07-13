<template>
  <Feed :on-avatar-click="onAvatarClick" />
</template>

<script setup lang="ts">
import Feed from '@/modules/Feed/Feed.vue'

interface TimelinePageProps {
  onAvatarClick: (page: string, username?: string) => void
}

defineProps<TimelinePageProps>()
</script>
