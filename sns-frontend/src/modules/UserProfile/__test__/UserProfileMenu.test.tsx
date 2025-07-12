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
});          