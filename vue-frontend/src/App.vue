<template>
  <v-app>
    <Authenticator v-if="route !== 'authenticated' && route !== 'setup'" />
    <template v-else>
      <Layout
        :active-page="activePage"
        @navigate="handleNavigate"
      >
        <ProfilePage
          v-if="activePage === 'profile'"
          :username="profileUsername"
        />
        <TimelinePage
          v-else
          @avatar-click="handleNavigate"
        />
      </Layout>
    </template>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Authenticator } from '@aws-amplify/ui-vue'
import { useAuthenticator } from '@aws-amplify/ui-vue'
import Layout from '@/components/Layout/Layout.vue'
import TimelinePage from '@/pages/TimelinePage/TimelinePage.vue'
import ProfilePage from '@/pages/ProfilePage/ProfilePage.vue'

const { route } = useAuthenticator()

const activePage = ref<"home" | "profile">("home")
const profileUsername = ref<string | undefined>()

const handleNavigate = (page: string, username?: string) => {
  if (page === "home") {
    activePage.value = "home"
    profileUsername.value = undefined
    window.history.pushState({}, "", "/")
  } else if (page === "profile") {
    activePage.value = "profile"
    profileUsername.value = username
    window.history.pushState({}, "", `/profile/${username}`)
  }
}
</script>

<style scoped>
/* App-specific styles */
</style>
