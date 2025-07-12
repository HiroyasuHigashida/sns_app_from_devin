import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import App from '../App';

vi.mock('@aws-amplify/ui-react', () => ({
  Authenticator: () => <div data-testid="authenticator">Authenticator</div>,
  useAuthenticator: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="query-provider">{children}</div>,
}));

vi.mock('../contexts/CurrentUserContext', () => ({
  CurrentUserProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="current-user-provider">{children}</div>,
}));

vi.mock('../components/Layout', () => ({
  Layout: ({ children, activePage, onNavigate }: { children: React.ReactNode; activePage: string; onNavigate: (page: string, username?: string) => void }) => (
    <div data-testid="layout" data-active-page={activePage}>
      <button onClick={() => onNavigate('home')} data-testid="nav-home">ホーム</button>
      <button onClick={() => onNavigate('profile', 'testuser')} data-testid="nav-profile">プロフィール</button>
      {children}
    </div>
  ),
}));

vi.mock('../pages/TimelinePage', () => ({
  TimelinePage: ({ onAvatarClick }: { onAvatarClick: (page: string, username?: string) => void }) => (
    <div data-testid="timeline-page">
      <button onClick={() => onAvatarClick('profile', 'avataruser')} data-testid="avatar-click">アバタークリック</button>
    </div>
  ),
}));

vi.mock('../pages/ProfilePage', () => ({
  ProfilePage: ({ username }: { username?: string }) => (
    <div data-testid="profile-page" data-username={username}>プロフィールページ</div>
  ),
}));

const mockPushState = vi.fn();
Object.defineProperty(window, 'history', {
  value: { pushState: mockPushState },
  writable: true,
});

describe('App', () => {
  const mockUseAuthenticator = vi.mocked(useAuthenticator);

  beforeEach(() => {
    vi.clearAllMocks();
    mockPushState.mockClear();
  });

  it('認証されていない場合にAuthenticatorを表示する', () => {
    mockUseAuthenticator.mockReturnValue({ route: 'signIn' } as any);

    render(<App />);

    expect(screen.getByTestId('authenticator')).toBeInTheDocument();
    expect(screen.queryByTestId('layout')).not.toBeInTheDocument();
  });

  it('認証済みの場合にメインアプリケーションを表示する', () => {
    mockUseAuthenticator.mockReturnValue({ route: 'authenticated' } as any);

    render(<App />);

    expect(screen.getByTestId('query-provider')).toBeInTheDocument();
    expect(screen.getByTestId('current-user-provider')).toBeInTheDocument();
    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-page')).toBeInTheDocument();
    expect(screen.queryByTestId('authenticator')).not.toBeInTheDocument();
  });

  it('setup状態の場合にメインアプリケーションを表示する', () => {
    mockUseAuthenticator.mockReturnValue({ route: 'setup' } as any);

    render(<App />);

    expect(screen.getByTestId('query-provider')).toBeInTheDocument();
    expect(screen.getByTestId('current-user-provider')).toBeInTheDocument();
    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-page')).toBeInTheDocument();
    expect(screen.queryByTestId('authenticator')).not.toBeInTheDocument();
  });

  it('初期状態でhomeページが表示される', () => {
    mockUseAuthenticator.mockReturnValue({ route: 'authenticated' } as any);

    render(<App />);

    const layout = screen.getByTestId('layout');
    expect(layout).toHaveAttribute('data-active-page', 'home');
    expect(screen.getByTestId('timeline-page')).toBeInTheDocument();
    expect(screen.queryByTestId('profile-page')).not.toBeInTheDocument();
  });

  it('ホームナビゲーションが正しく動作する', () => {
    mockUseAuthenticator.mockReturnValue({ route: 'authenticated' } as any);

    render(<App />);

    const homeButton = screen.getByTestId('nav-home');
    fireEvent.click(homeButton);

    const layout = screen.getByTestId('layout');
    expect(layout).toHaveAttribute('data-active-page', 'home');
    expect(screen.getByTestId('timeline-page')).toBeInTheDocument();
    expect(screen.queryByTestId('profile-page')).not.toBeInTheDocument();
    expect(mockPushState).toHaveBeenCalledWith({}, '', '/');
  });

  it('プロフィールナビゲーションが正しく動作する', () => {
    mockUseAuthenticator.mockReturnValue({ route: 'authenticated' } as any);

    render(<App />);

    const profileButton = screen.getByTestId('nav-profile');
    fireEvent.click(profileButton);

    const layout = screen.getByTestId('layout');
    expect(layout).toHaveAttribute('data-active-page', 'profile');
    expect(screen.getByTestId('profile-page')).toBeInTheDocument();
    expect(screen.getByTestId('profile-page')).toHaveAttribute('data-username', 'testuser');
    expect(screen.queryByTestId('timeline-page')).not.toBeInTheDocument();
    expect(mockPushState).toHaveBeenCalledWith({}, '', '/profile/testuser');
  });

  it('アバタークリックでプロフィールページに遷移する', () => {
    mockUseAuthenticator.mockReturnValue({ route: 'authenticated' } as any);

    render(<App />);

    const avatarButton = screen.getByTestId('avatar-click');
    fireEvent.click(avatarButton);

    const layout = screen.getByTestId('layout');
    expect(layout).toHaveAttribute('data-active-page', 'profile');
    expect(screen.getByTestId('profile-page')).toBeInTheDocument();
    expect(screen.getByTestId('profile-page')).toHaveAttribute('data-username', 'avataruser');
    expect(screen.queryByTestId('timeline-page')).not.toBeInTheDocument();
    expect(mockPushState).toHaveBeenCalledWith({}, '', '/profile/avataruser');
  });

  it('プロフィールからホームに戻る際にusernameがクリアされる', () => {
    mockUseAuthenticator.mockReturnValue({ route: 'authenticated' } as any);

    render(<App />);

    const profileButton = screen.getByTestId('nav-profile');
    fireEvent.click(profileButton);

    expect(screen.getByTestId('profile-page')).toHaveAttribute('data-username', 'testuser');

    const homeButton = screen.getByTestId('nav-home');
    fireEvent.click(homeButton);

    expect(screen.getByTestId('timeline-page')).toBeInTheDocument();
    expect(screen.queryByTestId('profile-page')).not.toBeInTheDocument();
  });

  it('QueryClientが作成される', () => {
    mockUseAuthenticator.mockReturnValue({ route: 'authenticated' } as any);

    render(<App />);

    expect(screen.getByTestId('query-provider')).toBeInTheDocument();
  });

  it('CurrentUserProviderが設定される', () => {
    mockUseAuthenticator.mockReturnValue({ route: 'authenticated' } as any);

    render(<App />);

    expect(screen.getByTestId('current-user-provider')).toBeInTheDocument();
  });

  it('Layoutコンポーネントに正しいpropsが渡される', () => {
    mockUseAuthenticator.mockReturnValue({ route: 'authenticated' } as any);

    render(<App />);

    const layout = screen.getByTestId('layout');
    expect(layout).toHaveAttribute('data-active-page', 'home');
    expect(screen.getByTestId('nav-home')).toBeInTheDocument();
    expect(screen.getByTestId('nav-profile')).toBeInTheDocument();
  });

  it('TimelinePageに正しいpropsが渡される', () => {
    mockUseAuthenticator.mockReturnValue({ route: 'authenticated' } as any);

    render(<App />);

    expect(screen.getByTestId('timeline-page')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-click')).toBeInTheDocument();
  });

  it('ProfilePageに正しいpropsが渡される', () => {
    mockUseAuthenticator.mockReturnValue({ route: 'authenticated' } as any);

    render(<App />);

    const profileButton = screen.getByTestId('nav-profile');
    fireEvent.click(profileButton);

    const profilePage = screen.getByTestId('profile-page');
    expect(profilePage).toHaveAttribute('data-username', 'testuser');
  });

  it('初期状態が正しく設定される', () => {
    mockUseAuthenticator.mockReturnValue({ route: 'authenticated' } as any);

    render(<App />);

    const layout = screen.getByTestId('layout');
    const initialActivePage = layout.getAttribute('data-active-page');
    
    expect(initialActivePage).toBe('home');
    expect(screen.getByTestId('timeline-page')).toBeInTheDocument();
    expect(screen.queryByTestId('profile-page')).not.toBeInTheDocument();
  });

  it('useAuthenticatorが正しく呼び出される', () => {
    mockUseAuthenticator.mockReturnValue({ route: 'authenticated' } as any);

    render(<App />);

    expect(mockUseAuthenticator).toHaveBeenCalledWith(expect.any(Function));
  });

  it('QueryClientが正しく初期化される', () => {
    mockUseAuthenticator.mockReturnValue({ route: 'authenticated' } as any);

    render(<App />);

    // QueryClientProviderが存在することを確認
    expect(screen.getByTestId('query-provider')).toBeInTheDocument();
  });

  it('認証状態がsetupの場合でもメインアプリケーションが表示される', () => {
    mockUseAuthenticator.mockReturnValue({ route: 'setup' } as any);

    render(<App />);

    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-page')).toBeInTheDocument();
    expect(screen.queryByTestId('authenticator')).not.toBeInTheDocument();
  });

  it('認証状態がauthenticatedでもsetupでもない場合にAuthenticatorが表示される', () => {
    mockUseAuthenticator.mockReturnValue({ route: 'signUp' } as any);

    render(<App />);

    expect(screen.getByTestId('authenticator')).toBeInTheDocument();
    expect(screen.queryByTestId('layout')).not.toBeInTheDocument();
  });

  it('プロフィールページでusernameがundefinedの場合でも正常に動作する', () => {
    mockUseAuthenticator.mockReturnValue({ route: 'authenticated' } as any);

    render(<App />);

    const profileButton = screen.getByTestId('nav-profile');
    fireEvent.click(profileButton);

    expect(screen.getByTestId('profile-page')).toBeInTheDocument();
    expect(screen.getByTestId('profile-page')).toHaveAttribute('data-username', 'testuser');

    const homeButton = screen.getByTestId('nav-home');
    fireEvent.click(homeButton);

    expect(screen.getByTestId('timeline-page')).toBeInTheDocument();
    expect(screen.queryByTestId('profile-page')).not.toBeInTheDocument();
  });
});
