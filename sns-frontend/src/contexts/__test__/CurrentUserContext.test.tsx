import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, renderHook } from '../../test-utils';
import { CurrentUserProvider, useCurrentUser } from '../CurrentUserContext';
import { useAuthenticator } from '@aws-amplify/ui-react';

vi.mock('@aws-amplify/ui-react', () => ({
  useAuthenticator: vi.fn(),
}));

describe('CurrentUserContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('ユーザーが認証されている場合にユーザー名を提供する', () => {
    const mockUser = {
      username: 'testuser',
      attributes: { email: 'test@example.com' },
    };

    vi.mocked(useAuthenticator).mockReturnValue({
      user: mockUser,
    } as any);

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: CurrentUserProvider,
    });

    expect(result.current.username).toBe('testuser');
    expect(result.current.isOwner('testuser')).toBe(true);
    expect(result.current.isOwner('otheruser')).toBe(false);
  });

  it('ユーザーが認証されていない場合にnullを返す', () => {
    vi.mocked(useAuthenticator).mockReturnValue({
      user: null,
    } as any);

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: CurrentUserProvider,
    });

    expect(result.current.username).toBeNull();
    expect(result.current.isOwner('testuser')).toBe(false);
  });

  it('isOwner関数が正しく動作する', () => {
    const mockUser = {
      username: 'testuser',
      attributes: { email: 'test@example.com' },
    };

    vi.mocked(useAuthenticator).mockReturnValue({
      user: mockUser,
    } as any);

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: CurrentUserProvider,
    });

    expect(result.current.isOwner('testuser')).toBe(true);
    expect(result.current.isOwner('otheruser')).toBe(false);
    expect(result.current.isOwner('')).toBe(false);
  });

  it('CurrentUserProviderが子コンポーネントをレンダリングする', () => {
    const mockUser = {
      username: 'testuser',
      attributes: { email: 'test@example.com' },
    };

    vi.mocked(useAuthenticator).mockReturnValue({
      user: mockUser,
    } as any);

    const TestComponent = () => {
      const { username } = useCurrentUser();
      return <div>User: {username || 'No user'}</div>;
    };

    render(
      <CurrentUserProvider>
        <TestComponent />
      </CurrentUserProvider>
    );

    expect(screen.getByText('User: testuser')).toBeInTheDocument();
  });

  it('useCurrentUserがプロバイダー外で使用された場合にエラーをスローする', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useCurrentUser(), {
        wrapper: ({ children }) => <div>{children}</div>, // CurrentUserProviderを使わない
      });
    }).toThrow('useCurrentUser must be used within a CurrentUserProvider');

    consoleSpy.mockRestore();
  });

  it('CurrentUserProviderが複数の子要素を正しくレンダリングする', () => {
    const mockUser = {
      username: 'testuser',
      attributes: { email: 'test@example.com' },
    };

    vi.mocked(useAuthenticator).mockReturnValue({
      user: mockUser,
    } as any);

    render(
      <CurrentUserProvider>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
      </CurrentUserProvider>
    );

    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
  });

  it('useAuthenticatorのコンテキストセレクターが正しく動作する', () => {
    const mockUser = {
      username: 'testuser',
      attributes: { email: 'test@example.com' },
    };

    const mockUseAuthenticator = vi.mocked(useAuthenticator);
    mockUseAuthenticator.mockReturnValue({
      user: mockUser,
    } as any);

    const TestComponent = () => {
      const { username } = useCurrentUser();
      return <div>User: {username}</div>;
    };

    render(
      <CurrentUserProvider>
        <TestComponent />
      </CurrentUserProvider>
    );

    expect(mockUseAuthenticator).toHaveBeenCalledWith(expect.any(Function));
    expect(screen.getByText('User: testuser')).toBeInTheDocument();
  });

  it('userがundefinedの場合にusernameがnullになる', () => {
    vi.mocked(useAuthenticator).mockReturnValue({
      user: undefined,
    } as any);

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: CurrentUserProvider,
    });

    expect(result.current.username).toBeNull();
    expect(result.current.isOwner('testuser')).toBe(false);
  });

  it('usernameがundefinedの場合にnullが返される', () => {
    const mockUser = {
      username: undefined,
      attributes: { email: 'test@example.com' },
    };

    vi.mocked(useAuthenticator).mockReturnValue({
      user: mockUser,
    } as any);

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: CurrentUserProvider,
    });

    expect(result.current.username).toBeNull();
    expect(result.current.isOwner('testuser')).toBe(false);
  });

  it('コンテキストセレクター関数が正しく動作する', () => {
    const mockUser = {
      username: 'testuser',
      attributes: { email: 'test@example.com' },
    };

    const mockUseAuthenticator = vi.mocked(useAuthenticator);
    mockUseAuthenticator.mockReturnValue({
      user: mockUser,
    } as any);

    const TestComponent = () => {
      const { username } = useCurrentUser();
      return <div>User: {username}</div>;
    };

    render(
      <CurrentUserProvider>
        <TestComponent />
      </CurrentUserProvider>
    );

    expect(mockUseAuthenticator).toHaveBeenCalledWith(expect.any(Function));
    expect(screen.getByText('User: testuser')).toBeInTheDocument();
  });

  it('プロバイダーのvalueが正しく計算される', () => {
    const mockUser = {
      username: 'testuser',
      attributes: { email: 'test@example.com' },
    };

    vi.mocked(useAuthenticator).mockReturnValue({
      user: mockUser,
    } as any);

    const TestComponent = () => {
      const context = useCurrentUser();
      return (
        <div>
          <span data-testid="username">{context.username}</span>
          <span data-testid="is-owner-self">{context.isOwner('testuser').toString()}</span>
          <span data-testid="is-owner-other">{context.isOwner('otheruser').toString()}</span>
        </div>
      );
    };

    render(
      <CurrentUserProvider>
        <TestComponent />
      </CurrentUserProvider>
    );

    expect(screen.getByTestId('username')).toHaveTextContent('testuser');
    expect(screen.getByTestId('is-owner-self')).toHaveTextContent('true');
    expect(screen.getByTestId('is-owner-other')).toHaveTextContent('false');
  });

  it('CurrentUserProviderのuseMemo依存配列が正しく動作する', () => {
    const mockUser = {
      username: 'testuser',
      attributes: { email: 'test@example.com' },
    };

    const mockUseAuthenticator = vi.mocked(useAuthenticator);
    mockUseAuthenticator.mockReturnValue({
      user: mockUser,
    } as any);

    const TestComponent = () => {
      const { username, isOwner } = useCurrentUser();
      return (
        <div>
          <span data-testid="username">{username}</span>
          <span data-testid="is-owner-function">{typeof isOwner}</span>
        </div>
      );
    };

    const { rerender } = render(
      <CurrentUserProvider>
        <TestComponent />
      </CurrentUserProvider>
    );

    expect(screen.getByTestId('username')).toHaveTextContent('testuser');
    expect(screen.getByTestId('is-owner-function')).toHaveTextContent('function');

    rerender(
      <CurrentUserProvider>
        <TestComponent />
      </CurrentUserProvider>
    );

    expect(screen.getByTestId('username')).toHaveTextContent('testuser');
    expect(screen.getByTestId('is-owner-function')).toHaveTextContent('function');
  });

  it('isOwner関数がnullユーザー名で正しく動作する', () => {
    vi.mocked(useAuthenticator).mockReturnValue({
      user: null,
    } as any);

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: CurrentUserProvider,
    });

    expect(result.current.isOwner('testuser')).toBe(false);
    expect(result.current.isOwner('')).toBe(false);
    expect(result.current.isOwner('null')).toBe(false);
  });

  it('isOwner関数が空文字列ユーザー名で正しく動作する', () => {
    const mockUser = {
      username: '',
      attributes: { email: 'test@example.com' },
    };

    vi.mocked(useAuthenticator).mockReturnValue({
      user: mockUser,
    } as any);

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: CurrentUserProvider,
    });

    expect(result.current.username).toBeNull();
    expect(result.current.isOwner('')).toBe(false);
    expect(result.current.isOwner('testuser')).toBe(false);
  });

  it('useAuthenticatorのコンテキストセレクター関数が正しく呼び出される', () => {
    const mockUser = {
      username: 'testuser',
      attributes: { email: 'test@example.com' },
    };

    const mockUseAuthenticator = vi.mocked(useAuthenticator);
    mockUseAuthenticator.mockReturnValue({
      user: mockUser,
    } as any);

    renderHook(() => useCurrentUser(), {
      wrapper: CurrentUserProvider,
    });

    expect(mockUseAuthenticator).toHaveBeenCalledWith(expect.any(Function));
    
    const selectorFunction = mockUseAuthenticator.mock.calls[0]?.[0];
    if (selectorFunction) {
      const mockContext = { user: mockUser } as any;
      const result = selectorFunction(mockContext);
      expect(result).toEqual([mockUser]);
    }
  });

  it('プロバイダーが異なるユーザー状態で正しく再レンダリングされる', () => {
    const mockUseAuthenticator = vi.mocked(useAuthenticator);
    
    mockUseAuthenticator.mockReturnValue({
      user: { username: 'user1' },
    } as any);

    const TestComponent = () => {
      const { username, isOwner } = useCurrentUser();
      return (
        <div>
          <span data-testid="username">{username}</span>
          <span data-testid="is-owner-user1">{isOwner('user1').toString()}</span>
          <span data-testid="is-owner-user2">{isOwner('user2').toString()}</span>
        </div>
      );
    };

    const { rerender } = render(
      <CurrentUserProvider>
        <TestComponent />
      </CurrentUserProvider>
    );

    expect(screen.getByTestId('username')).toHaveTextContent('user1');
    expect(screen.getByTestId('is-owner-user1')).toHaveTextContent('true');
    expect(screen.getByTestId('is-owner-user2')).toHaveTextContent('false');

    mockUseAuthenticator.mockReturnValue({
      user: { username: 'user2' },
    } as any);

    rerender(
      <CurrentUserProvider>
        <TestComponent />
      </CurrentUserProvider>
    );

    expect(screen.getByTestId('username')).toHaveTextContent('user2');
    expect(screen.getByTestId('is-owner-user1')).toHaveTextContent('false');
    expect(screen.getByTestId('is-owner-user2')).toHaveTextContent('true');
  });
});
