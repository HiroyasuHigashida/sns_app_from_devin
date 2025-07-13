<template>
  <v-app>
    <v-navigation-drawer
      v-if="!isMobile"
      permanent
      :width="drawerWidth"
      class="layout-sidenav"
    >
      <SideNav
        :active-page="activePage"
        :on-navigate="onNavigate"
      />
    </v-navigation-drawer>

    <v-main class="layout-main">
      <v-container
        fluid
        class="layout-container"
      >
        <v-row
          justify="center"
          no-gutters
        >
          <v-col
            cols="12"
            class="layout-feed"
          >
            <slot />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import SideNav from '@/modules/SideNav/SideNav.vue'

interface LayoutProps {
  activePage: "home" | "profile"
  onNavigate: () => void
}

defineProps<LayoutProps>()

const { mdAndUp } = useDisplay()
const isMobile = computed(() => !mdAndUp.value)

const drawerWidth = computed(() => {
  return mdAndUp.value ? (useDisplay().lgAndUp.value ? 275 : 240) : 240
})
</script>

<style scoped>
.layout-main {
  height: 100vh;
  overflow: hidden;
}

.layout-container {
  height: 100vh;
  padding: 0;
  max-width: none;
}

.layout-feed {
  max-width: 600px;
  margin: 0 auto;
  border-left: 1px solid #eaeaea;
  border-right: 1px solid #eaeaea;
  height: 100vh;
  overflow: auto;
}

.layout-sidenav {
  z-index: 10;
}

@media (max-width: 960px) {
  .layout-feed {
    border-left: none;
    border-right: none;
  }
}
</style>
