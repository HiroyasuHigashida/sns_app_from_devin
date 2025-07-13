<template>
  <v-card
    flat
    class="sidenav-container"
    height="100vh"
  >
    <!-- アプリケーションロゴ -->
    <div class="sidenav-logo">
      <v-text class="text-h4">
        K
      </v-text>
    </div>

    <!-- ナビゲーションリンクリスト -->
    <v-list class="sidenav-nav-list">
      <NavLink
        icon="mdi-home-outline"
        active-icon="mdi-home"
        label="ホーム"
        :is-active="activePage === 'home'"
        @click="() => handleNavigate('home')"
      />
      <NavLink
        icon="mdi-account-outline"
        active-icon="mdi-account"
        label="プロフィール"
        :is-active="activePage === 'profile'"
        @click="() => handleNavigate('profile')"
      />
    </v-list>

    <!-- ユーザープロフィールメニュー -->
    <UserProfileMenu />
  </v-card>
</template>

<script setup lang="ts">
import NavLink from '@/components/NavLink/NavLink.vue'
import UserProfileMenu from '@/modules/UserProfile/UserProfileMenu.vue'
import { useCurrentUser } from '@/composables/useCurrentUser'

interface SideNavProps {
  activePage?:
    | "home"
    | "explore"
    | "notifications"
    | "messages"
    | "bookmarks"
    | "profile"
  onNavigate?: () => void
}

const props = withDefaults(defineProps<SideNavProps>(), {
  activePage: "home"
})

const { user } = useCurrentUser()

const handleNavigate = (page: string) => {
  console.log('SideNav handleNavigate called with:', page, 'username:', user.value?.username)
  if (props.onNavigate) {
    if (page === "profile") {
      props.onNavigate(page, user.value?.username || "")
    } else {
      props.onNavigate(page)
    }
  }
}
</script>

<style scoped>
.sidenav-container {
  border-right: 1px solid #eaeaea;
  position: sticky;
  top: 0;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.sidenav-logo {
  margin-bottom: 16px;
}

.sidenav-nav-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
}
</style>
