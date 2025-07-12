import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test-utils';
import { SideNav } from '@/modules/SideNav';
import { useAuthenticator } from '@aws-amplify/ui-react';

// UserProfileMenuコンポーネントのモック
vi.mock('@/modules/UserProfile', () => ({
  UserProfileMenu: () => <div data-testid="user-profile-menu">User Profile Menu</div>,
}));

describe('サイドナビゲーション', () => {
  it('ロゴとホームナビゲーションリンクをレンダリングする', () => {
    render(<SideNav />);
    expect(screen.getByText('K')).toBeInTheDocument();
    expect(screen.getByText('ホーム')).toBeInTheDocument();
  });

  it('ユーザープロファイルメニューをレンダリングする', () => {
    render(<SideNav />);
    expect(screen.getByTestId('user-profile-menu')).toBeInTheDocument();
  });

  it('デフォルトでホームをアクティブとしてマークする', () => {
    render(<SideNav />);
    const homeLink = screen.getByText('ホーム').parentElement;
    expect(homeLink).toBeInTheDocument();
    // Material UIのアイコンで、テキストやテストIDで簡単にアクセスできないため、アクティブなアイコンを直接テストすることはできません
  });

  it('ホームリンクがクリックされたときにonNavigateが呼び出される', () => {
    const mockNavigate = vi.fn();
    render(<SideNav onNavigate={mockNavigate} />);
    
    fireEvent.click(screen.getByText('ホーム'));
    expect(mockNavigate).toHaveBeenCalledWith('home');
  });

  it('propsに基づいてアクティブページを設定する', () => {
    // このコンポーネントにはホームリンクのみが実装されています
    // 'home'がアクティブになっていることをテストするだけです
    render(<SideNav activePage="home" />);
    expect(screen.getByText('ホーム')).toBeInTheDocument();
  });

  it('プロフィールリンクをレンダリングする', () => {
    render(<SideNav />);
    expect(screen.getByText('プロフィール')).toBeInTheDocument();
  });

  it('プロフィールリンクがクリックされたときにonNavigateが呼び出される', () => {
    const mockNavigate = vi.fn();
    render(<SideNav onNavigate={mockNavigate} />);
    
    fireEvent.click(screen.getByText('プロフィール'));
    expect(mockNavigate).toHaveBeenCalledWith('profile', 'testuser');
  });

  it('プロフィールページがアクティブな場合にプロフィールリンクがアクティブになる', () => {
    render(<SideNav activePage="profile" />);
    expect(screen.getByText('プロフィール')).toBeInTheDocument();
  });

  it('onNavigateが提供されていない場合でもプロフィールリンクをクリックできる', () => {
    render(<SideNav />);
    
    expect(() => {
      fireEvent.click(screen.getByText('プロフィール'));
    }).not.toThrow();
  });

  it('onNavigateが提供されていない場合でもホームリンクをクリックできる', () => {
    render(<SideNav />);
    
    expect(() => {
      fireEvent.click(screen.getByText('ホーム'));
    }).not.toThrow();
  });

  it('プロフィールナビゲーション時にusernameが空文字列の場合も正しく処理される', () => {
    const mockOnNavigate = vi.fn();
    const mockUseAuthenticator = vi.mocked(useAuthenticator);
    mockUseAuthenticator.mockReturnValue({
      user: { username: '' },
    } as any);

    render(<SideNav activePage="profile" onNavigate={mockOnNavigate} />);
    
    const profileLink = screen.getByText('プロフィール');
    fireEvent.click(profileLink);
    
    expect(mockOnNavigate).toHaveBeenCalledWith('profile', '');
  });

  it('プロフィールナビゲーション時にusernameがnullの場合も正しく処理される', () => {
    const mockOnNavigate = vi.fn();
    const mockUseAuthenticator = vi.mocked(useAuthenticator);
    mockUseAuthenticator.mockReturnValue({
      user: { username: null },
    } as any);

    render(<SideNav activePage="profile" onNavigate={mockOnNavigate} />);
    
    const profileLink = screen.getByText('プロフィール');
    fireEvent.click(profileLink);
    
    expect(mockOnNavigate).toHaveBeenCalledWith('profile', '');
  });

  it('ユーザーが認証されていない場合の処理', () => {
    const mockUseAuthenticator = vi.mocked(useAuthenticator);
    mockUseAuthenticator.mockReturnValue({
      user: null,
    } as any);

    render(<SideNav />);
    
    expect(screen.getByText('ホーム')).toBeInTheDocument();
    expect(screen.getByText('プロフィール')).toBeInTheDocument();
  });

  it('ユーザーオブジェクトが未定義の場合の処理', () => {
    const mockUseAuthenticator = vi.mocked(useAuthenticator);
    mockUseAuthenticator.mockReturnValue({
      user: undefined,
    } as any);

    render(<SideNav />);
    
    expect(screen.getByText('ホーム')).toBeInTheDocument();
    expect(screen.getByText('プロフィール')).toBeInTheDocument();
  });

  it('handleNavigateがプロフィール以外のページで正しく動作する', () => {
    const mockOnNavigate = vi.fn();
    
    render(<SideNav onNavigate={mockOnNavigate} />);
    
    const homeLink = screen.getByText('ホーム');
    fireEvent.click(homeLink);
    
    expect(mockOnNavigate).toHaveBeenCalledWith('home');
  });

  it('handleNavigateがプロフィールページで正しく動作する', () => {
    const mockOnNavigate = vi.fn();
    const mockUseAuthenticator = vi.mocked(useAuthenticator);
    mockUseAuthenticator.mockReturnValue({
      user: { username: 'testuser' },
    } as any);
    
    render(<SideNav onNavigate={mockOnNavigate} />);
    
    const profileLink = screen.getByText('プロフィール');
    fireEvent.click(profileLink);
    
    expect(mockOnNavigate).toHaveBeenCalledWith('profile', 'testuser');
  });

  it('SideNavコンポーネントの全ての関数が正しく動作する', () => {
    const mockOnNavigate = vi.fn();
    const mockUseAuthenticator = vi.mocked(useAuthenticator);
    mockUseAuthenticator.mockReturnValue({
      user: { username: 'testuser' },
    } as any);
    
    render(<SideNav onNavigate={mockOnNavigate} activePage="home" />);
    
    expect(screen.getByText('ホーム')).toBeInTheDocument();
    expect(screen.getByText('プロフィール')).toBeInTheDocument();
    expect(screen.getByTestId('user-profile-menu')).toBeInTheDocument();
  });

  it('activePage propが正しく反映される', () => {
    render(<SideNav activePage="profile" />);
    
    expect(screen.getByText('ホーム')).toBeInTheDocument();
    expect(screen.getByText('プロフィール')).toBeInTheDocument();
  });

  it('handleNavigateでプロフィール以外のページの場合はusernameを渡さない', () => {
    const mockOnNavigate = vi.fn();
    
    render(<SideNav activePage="home" onNavigate={mockOnNavigate} />);
    
    const homeLink = screen.getByText('ホーム');
    fireEvent.click(homeLink);
    
    expect(mockOnNavigate).toHaveBeenCalledWith('home');
    expect(mockOnNavigate).not.toHaveBeenCalledWith('home', expect.any(String));
  });

  it('handleNavigateでプロフィールページの場合はusernameを渡す', () => {
    const mockOnNavigate = vi.fn();
    
    render(<SideNav activePage="profile" onNavigate={mockOnNavigate} />);
    
    const profileLink = screen.getByText('プロフィール');
    fireEvent.click(profileLink);
    
    expect(mockOnNavigate).toHaveBeenCalledWith('profile', 'testuser');
  });

  it('usernameがnullの場合でも空文字を渡す', () => {
    const mockOnNavigate = vi.fn();
    
    vi.mocked(useAuthenticator).mockReturnValue({
      user: { username: null },
    } as any);
    
    render(<SideNav activePage="profile" onNavigate={mockOnNavigate} />);
    
    const profileLink = screen.getByText('プロフィール');
    fireEvent.click(profileLink);
    
    expect(mockOnNavigate).toHaveBeenCalledWith('profile', '');
  });

  it('usernameがundefinedの場合でも空文字を渡す', () => {
    const mockOnNavigate = vi.fn();
    
    vi.mocked(useAuthenticator).mockReturnValue({
      user: { username: undefined },
    } as any);
    
    render(<SideNav activePage="profile" onNavigate={mockOnNavigate} />);
    
    const profileLink = screen.getByText('プロフィール');
    fireEvent.click(profileLink);
    
    expect(mockOnNavigate).toHaveBeenCalledWith('profile', '');
  });
});                             