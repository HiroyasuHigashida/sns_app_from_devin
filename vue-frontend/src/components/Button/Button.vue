<template>
  <v-btn
    :variant="vuetifyVariant"
    :color="vuetifyColor"
    :size="size"
    :block="fullWidth"
    :prepend-icon="startIcon"
    :append-icon="endIcon"
    :style="{ borderRadius: '20px', textTransform: 'none' }"
    v-bind="$attrs"
  >
    <slot />
  </v-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ButtonProps {
  variant?: "primary" | "secondary" | "outlined"
  size?: "small" | "medium" | "large"
  fullWidth?: boolean
  startIcon?: string
  endIcon?: string
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: "primary",
  size: "medium",
  fullWidth: false
})

const vuetifyVariant = computed(() => {
  if (props.variant === "outlined") return "outlined"
  return "flat"
})

const vuetifyColor = computed(() => {
  if (props.variant === "primary") return "primary"
  if (props.variant === "secondary") return "secondary"
  return "primary"
})
</script>
