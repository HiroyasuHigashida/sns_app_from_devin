<template>
  <v-avatar
    :size="sizeValue"
    :style="{ cursor: onClick ? 'pointer' : 'default' }"
    @click="onClick"
  >
    <v-img
      v-if="src"
      :src="src"
      :alt="alt"
      cover
    />
    <span v-else>{{ alt.charAt(0).toUpperCase() }}</span>
  </v-avatar>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface AvatarProps {
  src?: string
  alt: string
  size?: "small" | "medium" | "large"
  onClick?: () => void
}

const props = withDefaults(defineProps<AvatarProps>(), {
  size: "medium"
})

const sizeValue = computed(() => {
  switch (props.size) {
    case "small":
      return 32
    case "large":
      return 56
    case "medium":
    default:
      return 40
  }
})
</script>
