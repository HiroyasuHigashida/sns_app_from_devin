import { computed, provide, inject, type InjectionKey } from 'vue'
import { useAuthenticator } from '@aws-amplify/ui-vue'

interface CurrentUserContextType {
  user: any
  username: string | null
  isOwner: (_postUsername: string) => boolean
  signOut: () => void
}

const CurrentUserKey: InjectionKey<CurrentUserContextType> = Symbol('CurrentUser')

export function provideCurrentUser() {
  const { user, signOut } = useAuthenticator()
  
  const username = computed(() => user.value?.username || null)
  const isOwner = (_postUsername: string) => username.value === _postUsername

  const currentUserContext: CurrentUserContextType = {
    user,
    get username() { return username.value },
    isOwner,
    signOut
  }

  provide(CurrentUserKey, currentUserContext)
  
  return currentUserContext
}

export function useCurrentUser() {
  const context = inject(CurrentUserKey)
  if (!context) {
    throw new Error('useCurrentUser must be used within a component that calls provideCurrentUser')
  }
  return context
}
