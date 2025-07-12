import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Feed } from '@/modules/Feed';

// APIフックのモック
vi.mock('../api/usePost', () => ({
  usePost: vi.fn(() => ({
    mutate: vi.fn(),
  })),
}));

vi.mock('../api/useGetPost', () => ({
  useGetPost: vi.fn(() => ({
    refetch: vi.fn(),
    data: [],
    isLoading: false,
    isError: false,
    error: null,
  })),
}));

// AWS Amplify認証のモック
vi.mock('@aws-amplify/ui-react', () => ({
  useAuthenticator: vi.fn(() => ({
    user: {
      username: 'testuser',
    },
  })),
}));

describe('フィード', () => {
  it('ポストフォームをレンダリングする', () => {
    render(<Feed />);
    expect(screen.getByPlaceholderText('今どうしてる？')).toBeInTheDocument();
  });

  it('ポストがない場合に空の状態メッセージを表示する', () => {
    render(<Feed />);
    expect(screen.getByText('まだ投稿がありません。ポストを始めましょう！')).toBeInTheDocument();
  });

  it('ユーザーアバターが提供されるとレンダリングされる', () => {
    render(<Feed userAvatar="https://example.com/avatar.jpg" />);
    expect(screen.getByAltText('User')).toBeInTheDocument();
  });

  it('ポストが利用可能な場合にレンダリングされる', () => {
    // この特定のテストのためにモックを上書き

    vi.mocked(useGetPost).mockReturnValue({
      refetch: vi.fn(),
      data: [
        {
          id: 1,
          username: 'John Doe',
          handle: 'johndoe',
          avatar: "",
          content: 'Test post content',
          timestamp: '2h',
          likes: 5,
          comments: 2,
          retweets: 1,
          isLiked: false,
        },
      ],
    } as any);

    render(<Feed />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('@johndoe')).toBeInTheDocument();
    expect(screen.getByText('Test post content')).toBeInTheDocument();
  });
});

// TypeScriptを満たすためにAPIフックをインポート
import { useGetPost } from '@/modules/Feed/api/useGetPost';            