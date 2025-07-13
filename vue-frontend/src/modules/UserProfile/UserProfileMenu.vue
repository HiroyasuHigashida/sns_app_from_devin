<template>
  <div
    v-if="user"
    class="user-profile-menu"
  >
    <!-- ユーザー情報表示部分 -->
    <v-card
      flat
      class="user-box"
      @click="handleClick"
    >
      <div class="user-content">
        <v-avatar class="user-avatar">
          <v-icon>mdi-account</v-icon>
        </v-avatar>
        
        <div class="user-info">
          <div class="username">
            {{ user.username || "ユーザー" }}
          </div>
          <div class="handle">
            @{{ (user.username || "user").toLowerCase() }}
          </div>
        </div>
        
        <v-btn
          icon
          size="small"
          variant="text"
        >
          <v-icon size="small">
            mdi-dots-horizontal
          </v-icon>
        </v-btn>
      </div>
    </v-card>

    <!-- ドロップダウンメニュー -->
    <v-menu
      v-model="menuOpen"
      :activator="menuActivator || undefined"
      location="top end"
      origin="bottom end"
    >
      <v-list>
        <v-list-item @click="handleLogout">
          <template #prepend>
            <v-icon>mdi-logout</v-icon>
          </template>
          <v-list-item-title>ログアウト</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCurrentUser } from '@/composables/useCurrentUser'

const { user, signOut } = useCurrentUser()
const menuOpen = ref(false)
const menuActivator = ref<HTMLElement | null>(null)

const handleClick = (event: Event) => {
  menuActivator.value = event.currentTarget as HTMLElement | null
  menuOpen.value = true
}

const handleLogout = () => {
  menuOpen.value = false
  if (signOut) {
    signOut()
  }
}
</script>

<style scoped>
.user-profile-menu {
  margin-top: auto;
}

.user-box {
  cursor: pointer;
  border-radius: 12px;
  padding: 12px;
  transition: background-color 0.2s;
}

.user-box:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.user-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.username {
  font-weight: 500;
  font-size: 15px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.handle {
  color: rgb(83, 100, 113);
  font-size: 15px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
