<template>
  <v-list-item
    :class="{ 'nav-link-active': isActive }"
    class="nav-link"
    @click="onClick"
  >
    <template #prepend>
      <v-icon v-if="isActive && activeIcon">
        {{ activeIcon }}
      </v-icon>
      <v-icon v-else>
        {{ icon }}
      </v-icon>
    </template>
    
    <v-list-item-title class="nav-link-text">
      {{ label }}
    </v-list-item-title>
  </v-list-item>
</template>

<script setup lang="ts">
interface NavLinkProps {
  icon: string
  activeIcon?: string
  label: string
  isActive?: boolean
  onClick?: () => void
}

withDefaults(defineProps<NavLinkProps>(), {
  isActive: false
})
</script>

<style scoped>
.nav-link {
  cursor: pointer;
  border-radius: 12px;
  margin: 4px 0;
}

.nav-link:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.nav-link-active {
  background-color: rgba(25, 118, 210, 0.08);
}

.nav-link-text {
  font-weight: 500;
}

.nav-link-active .nav-link-text {
  font-weight: 700;
}
</style>
