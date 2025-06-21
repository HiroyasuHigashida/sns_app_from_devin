import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfileMenu } from '../UserProfileMenu';

// AWS Amplify認証のモック
const mockSignOut = vi.fn();
vi.mock('@aws-amplify/ui-react', () => ({
  useAuthenticator: vi.fn(() => ({
    user: {
      username: 'testuser',
    },
    signOut: mockSignOut,
  })),
}));

describe('ユーザープロファイルメニュー', () => {
  beforeEach(() => {
    mockSignOut.mockClear();
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
});

// TypeScriptを満たすための認証フックのインポート
// import { useAuthenticator } from '@aws-amplify/ui-react'; 