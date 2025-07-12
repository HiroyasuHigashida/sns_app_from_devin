import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Authenticator } from '@aws-amplify/ui-react';
import { CurrentUserProvider } from './contexts/CurrentUserContext';
import { vi } from 'vitest';

vi.mock('@aws-amplify/ui-react', () => ({
  useAuthenticator: vi.fn(() => ({
    user: {
      username: 'testuser',
      attributes: {
        email: 'test@example.com'
      }
    },
  })),
  Authenticator: {
    Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  },
}));

const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { 
        retry: false,
        refetchOnWindowFocus: false,
      },
      mutations: { 
        retry: false,
      },
    },
  });

  return (
    <Authenticator.Provider>
      <QueryClientProvider client={queryClient}>
        <CurrentUserProvider>
          {children}
        </CurrentUserProvider>
      </QueryClientProvider>
    </Authenticator.Provider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
