import type { Preview } from '@storybook/react'
import React from 'react'
import { Authenticator } from '@aws-amplify/ui-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// モックの認証コンテキストを提供するデコレーター
const withAuthenticator = (Story) => {
  // モックユーザー情報
  const mockUser = {
    username: 'testuser',
    attributes: {
      email: 'test@example.com',
      name: 'Test User',
      sub: '12345',
    },
  }

  // モックの認証状態
  const mockAuthState = {
    user: mockUser,
    signOut: () => console.log('Sign out'),
    route: 'authenticated',
  }

  return (
    <Authenticator.Provider>
      <Story />
    </Authenticator.Provider>
  )
}

// QueryClientProviderを提供するデコレーター
const withQueryClient = (Story) => {
  // デフォルトのQueryClientを作成
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  )
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
  decorators: [withQueryClient, withAuthenticator], // 複数のデコレーターを組み合わせる
};

export default preview;