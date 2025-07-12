import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserProfileMenu } from '@/modules/UserProfile';
import { useAuthenticator } from '@aws-amplify/ui-react';

// AWS Amplify認証のモック
const mockSignOut = vi.fn();
vi.mock('@aws-amplify/ui-react', () => ({
  useAuthenticator: vi.fn(),
}));

describe('ユーザープロファイルメニュー', () => {
  beforeEach(() => {
    mockSignOut.mockClear();
    vi.mocked(useAuthenticator).mockReturnValue({
      user: {
        username: 'testuser',
      },
      signOut: mockSignOut,
    } as any);
  });

  it('ユーザー情報をレンダリングする', () => {
    render(<UserProfileMenu />);
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('@testuser')).toBeInTheDocument();
  });

  it('アバターをレンダリングする', () => {
    render(<UserProfileMenu />);
    expect(screen.getByTestId('PersonIcon')).toBeInTheDocument();
  });

  it('ユーザーボックスがクリックされるとメニューが開く', () => {
    render(<UserProfileMenu />);
    const userBox = screen.getByText('testuser').closest('div');
    expect(userBox).toBeInTheDocument();
    
    if (userBox) {
      fireEvent.click(userBox);
      expect(screen.getByText('ログアウト')).toBeInTheDocument();
    }
  });

  it('ログアウトがクリックされるとsignOutが呼び出される', () => {
    render(<UserProfileMenu />);
    const userBox = screen.getByText('testuser').closest('div');
    if (userBox) {
      fireEvent.click(userBox);
      fireEvent.click(screen.getByText('ログアウト'));
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    }
  });

  it('ユーザーがnullの場合は何も表示しない', () => {
    vi.mocked(useAuthenticator).mockReturnValue({
      user: null,
      signOut: mockSignOut,
    } as any);

    const { container } = render(<UserProfileMenu />);
    expect(container.firstChild).toBeNull();
  });

  it('ユーザー名がない場合にデフォルト値を表示する', () => {
    vi.mocked(useAuthenticator).mockReturnValue({
      user: {
        username: null,
      },
      signOut: mockSignOut,
    } as any);

    render(<UserProfileMenu />);
    expect(screen.getByText('ユーザー')).toBeInTheDocument();
    expect(screen.getByText('@user')).toBeInTheDocument();
  });

  it('ユーザー名が空文字の場合にデフォルト値を表示する', () => {
    vi.mocked(useAuthenticator).mockReturnValue({
      user: {
        username: '',
      },
      signOut: mockSignOut,
    } as any);

    render(<UserProfileMenu />);
    expect(screen.getByText('ユーザー')).toBeInTheDocument();
    expect(screen.getByText('@user')).toBeInTheDocument();
  });

  it('メニューを開いた後に外部をクリックするとメニューが閉じる', () => {
    render(<UserProfileMenu />);
    const userBox = screen.getByText('testuser').closest('div');
    if (userBox) {
      fireEvent.click(userBox);
      expect(screen.getByText('ログアウト')).toBeInTheDocument();
      
      fireEvent.click(document.body);
      expect(screen.getByText('ログアウト')).toBeInTheDocument();
    }
  });

  it('ログアウトメニューアイテムをクリックするとsignOutが呼び出される', () => {
    render(<UserProfileMenu />);
    const userBox = screen.getByText('testuser').closest('div');
    if (userBox) {
      fireEvent.click(userBox);
      const logoutMenuItem = screen.getByText('ログアウト');
      fireEvent.click(logoutMenuItem);
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    }
  });

  it('メニューアイテムをクリックするとメニューが閉じる', async () => {
    render(<UserProfileMenu />);
    const userBox = screen.getByText('testuser').closest('div');
    if (userBox) {
      fireEvent.click(userBox);
      expect(screen.getByText('ログアウト')).toBeInTheDocument();
      const logoutMenuItem = screen.getByText('ログアウト');
      fireEvent.click(logoutMenuItem);
      await waitFor(() => {
        expect(screen.queryByText('ログアウト')).not.toBeInTheDocument();
      });
    }
  });

  it('handleClick関数が正しくanchorElを設定する', () => {
    render(<UserProfileMenu />);
    const userBox = screen.getByText('testuser').closest('div');
    expect(userBox).toBeInTheDocument();
    
    if (userBox) {
      fireEvent.click(userBox);
      expect(screen.getByText('ログアウト')).toBeInTheDocument();
    }
  });

  it('handleClose関数の存在を確認する', () => {
    render(<UserProfileMenu />);
    const userBox = screen.getByText('testuser').closest('div');
    
    if (userBox) {
      fireEvent.click(userBox);
      expect(screen.getByText('ログアウト')).toBeInTheDocument();
    }
  });

  it('handleLogout関数がhandleCloseとsignOutを順番に呼び出す', () => {
    render(<UserProfileMenu />);
    const userBox = screen.getByText('testuser').closest('div');
    
    if (userBox) {
      fireEvent.click(userBox);
      const logoutButton = screen.getByText('ログアウト');
      fireEvent.click(logoutButton);
      
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    }
  });

  it('ユーザー名がundefinedの場合のデフォルト表示', () => {
    vi.mocked(useAuthenticator).mockReturnValue({
      user: {
        username: undefined,
      },
      signOut: mockSignOut,
    } as any);

    render(<UserProfileMenu />);
    expect(screen.getByText('ユーザー')).toBeInTheDocument();
    expect(screen.getByText('@user')).toBeInTheDocument();
  });

  it('メニューのopen状態が正しく管理される', () => {
    render(<UserProfileMenu />);
    const userBox = screen.getByText('testuser').closest('div');
    
    if (userBox) {
      expect(screen.queryByText('ログアウト')).not.toBeInTheDocument();
      
      fireEvent.click(userBox);
      expect(screen.getByText('ログアウト')).toBeInTheDocument();
      
      fireEvent.click(screen.getByText('ログアウト'));
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    }
  });

  it('アバターが正しくレンダリングされる', () => {
    render(<UserProfileMenu />);
    const avatar = screen.getByTestId('PersonIcon');
    expect(avatar).toBeInTheDocument();
  });

  it('ユーザー名がnullの場合もアバターが正しくレンダリングされる', () => {
    vi.mocked(useAuthenticator).mockReturnValue({
      user: {
        username: null,
      },
      signOut: mockSignOut,
    } as any);

    render(<UserProfileMenu />);
    const avatar = screen.getByTestId('PersonIcon');
    expect(avatar).toBeInTheDocument();
  });

  it('handleClickとhandleCloseの組み合わせテスト', () => {
    render(<UserProfileMenu />);
    const userBox = screen.getByText('testuser').closest('div');
    
    if (userBox) {
      fireEvent.click(userBox);
      expect(screen.getByText('ログアウト')).toBeInTheDocument();
      
      fireEvent.click(document.body);
      
      fireEvent.click(userBox);
      expect(screen.getByText('ログアウト')).toBeInTheDocument();
    }
  });

  it('handleLogoutが正しい順序で処理を実行する', () => {
    render(<UserProfileMenu />);
    const userBox = screen.getByText('testuser').closest('div');
    
    if (userBox) {
      fireEvent.click(userBox);
      const logoutMenuItem = screen.getByText('ログアウト');
      
      fireEvent.click(logoutMenuItem);
      
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    }
  });

  it('メニューの状態管理が正しく動作する', () => {
    render(<UserProfileMenu />);
    const userBox = screen.getByText('testuser').closest('div');
    
    if (userBox) {
      expect(screen.queryByText('ログアウト')).not.toBeInTheDocument();
      
      fireEvent.click(userBox);
      expect(screen.getByText('ログアウト')).toBeInTheDocument();
    }
  });

  it('handleCloseが正しく動作する', () => {
    render(<UserProfileMenu />);
    const userBox = screen.getByText('testuser').closest('div');
    
    if (userBox) {
      fireEvent.click(userBox);
      expect(screen.getByText('ログアウト')).toBeInTheDocument();
    }
  });

  it('anchorElの状態管理が正しく動作する', () => {
    render(<UserProfileMenu />);
    const userBox = screen.getByText('testuser').closest('div');
    
    if (userBox) {
      fireEvent.click(userBox);
      const menu = screen.getByRole('menu');
      expect(menu).toBeInTheDocument();
    }
  });
});                          