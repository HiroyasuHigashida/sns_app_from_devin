<template>
  <Profile :username="username" />
</template>

<script setup lang="ts">
import Profile from '@/modules/Profile/Profile.vue'

interface ProfilePageProps {
  username?: string
}

defineProps<ProfilePageProps>()
</script>
