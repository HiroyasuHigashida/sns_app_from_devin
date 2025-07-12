import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '../../../../test-utils';
import { useGetOwnerPosts } from '../useGetOwnerPosts';

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

vi.mock('../../../../api/methods', () => ({
  get: vi.fn(),
}));

import { useQuery } from '@tanstack/react-query';
import { get } from '../../../../api/methods';

describe('useGetOwnerPosts', () => {
  const mockUseQuery = vi.mocked(useQuery);
  const mockGet = vi.mocked(get);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      isError: false,
      isSuccess: true,
    } as any);
  });

  it('useGetOwnerPostsフックが正しく初期化される', () => {
    const { result } = renderHook(() => useGetOwnerPosts('testuser'));
    
    expect(result.current).toHaveProperty('data');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('error');
    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ['ownerPosts', 'testuser', undefined, undefined],
      queryFn: expect.any(Function),
      retry: 0,
    });
  });

  it('offsetとlimitパラメータが正しく設定される', () => {
    const { result } = renderHook(() => useGetOwnerPosts('testuser', 10, 20));
    
    expect(result.current).toHaveProperty('data');
    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ['ownerPosts', 'testuser', 10, 20],
      queryFn: expect.any(Function),
      retry: 0,
    });
  });

  it('queryFnが正しくAPIを呼び出す（パラメータなし）', async () => {
    const mockResponseData = {
      Items: [
        {
          id: 1,
          type: 'post',
          content: 'テスト投稿1',
          user: {
            username: 'testuser',
            iconImage: 'avatar1.jpg',
          },
          postedAt: '2024-01-01T12:00:00Z',
          likeCount: 5,
          isLiked: false,
        },
        {
          id: 2,
          type: 'post',
          content: 'テスト投稿2',
          user: {
            username: 'testuser',
            iconImage: 'avatar2.jpg',
          },
          postedAt: '2024-01-01T11:00:00Z',
          likeCount: 3,
          isLiked: true,
        },
      ],
    };

    mockGet.mockResolvedValue(mockResponseData);
    
    renderHook(() => useGetOwnerPosts('testuser'));
    
    const queryConfig = mockUseQuery.mock.calls[0][0];
    const result = await queryConfig.queryFn!();
    
    expect(mockGet).toHaveBeenCalledWith('/api/posts/testuser');
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: 1,
      username: 'testuser',
      handle: 'testuser',
      avatar: 'avatar1.jpg',
      content: 'テスト投稿1',
      timestamp: expect.any(String),
      likes: 5,
      comments: 0,
      retweets: 0,
      isLiked: false,
    });
  });

  it('queryFnが正しくAPIを呼び出す（パラメータあり）', async () => {
    const mockResponseData = {
      Items: [],
    };

    mockGet.mockResolvedValue(mockResponseData);
    
    renderHook(() => useGetOwnerPosts('testuser', 10, 20));
    
    const queryConfig = mockUseQuery.mock.calls[0][0];
    await queryConfig.queryFn!();
    
    expect(mockGet).toHaveBeenCalledWith('/api/posts/testuser?offset=10&limit=20');
  });

  it('offsetのみが指定された場合', async () => {
    const mockResponseData = {
      Items: [],
    };

    mockGet.mockResolvedValue(mockResponseData);
    
    renderHook(() => useGetOwnerPosts('testuser', 10));
    
    const queryConfig = mockUseQuery.mock.calls[0][0];
    await queryConfig.queryFn!();
    
    expect(mockGet).toHaveBeenCalledWith('/api/posts/testuser?offset=10');
  });

  it('limitのみが指定された場合', async () => {
    const mockResponseData = {
      Items: [],
    };

    mockGet.mockResolvedValue(mockResponseData);
    
    renderHook(() => useGetOwnerPosts('testuser', undefined, 20));
    
    const queryConfig = mockUseQuery.mock.calls[0][0];
    await queryConfig.queryFn!();
    
    expect(mockGet).toHaveBeenCalledWith('/api/posts/testuser?limit=20');
  });

  it('投稿が日付順にソートされる', async () => {
    const mockResponseData = {
      Items: [
        {
          id: 1,
          type: 'post',
          content: '古い投稿',
          user: {
            username: 'testuser',
            iconImage: '',
          },
          postedAt: '2024-01-01T10:00:00Z',
          likeCount: 1,
          isLiked: false,
        },
        {
          id: 2,
          type: 'post',
          content: '新しい投稿',
          user: {
            username: 'testuser',
            iconImage: '',
          },
          postedAt: '2024-01-01T12:00:00Z',
          likeCount: 2,
          isLiked: false,
        },
      ],
    };

    mockGet.mockResolvedValue(mockResponseData);
    
    renderHook(() => useGetOwnerPosts('testuser'));
    
    const queryConfig = mockUseQuery.mock.calls[0][0];
    const result = await queryConfig.queryFn!();
    
    expect(result[0].content).toBe('新しい投稿');
    expect(result[1].content).toBe('古い投稿');
  });

  it('アイコン画像が空の場合に空文字が設定される', async () => {
    const mockResponseData = {
      Items: [
        {
          id: 1,
          type: 'post',
          content: 'テスト投稿',
          user: {
            username: 'testuser',
            iconImage: null,
          },
          postedAt: '2024-01-01T12:00:00Z',
          likeCount: 0,
          isLiked: false,
        },
      ],
    };

    mockGet.mockResolvedValue(mockResponseData);
    
    renderHook(() => useGetOwnerPosts('testuser'));
    
    const queryConfig = mockUseQuery.mock.calls[0][0];
    const result = await queryConfig.queryFn!();
    
    expect(result[0].avatar).toBe('');
  });

  it('formatTimestampが正しく動作する（分単位）', async () => {
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
    
    const mockResponseData = {
      Items: [
        {
          id: 1,
          type: 'post',
          content: 'テスト投稿',
          user: {
            username: 'testuser',
            iconImage: '',
          },
          postedAt: thirtyMinutesAgo.toISOString(),
          likeCount: 0,
          isLiked: false,
        },
      ],
    };

    mockGet.mockResolvedValue(mockResponseData);
    
    renderHook(() => useGetOwnerPosts('testuser'));
    
    const queryConfig = mockUseQuery.mock.calls[0][0];
    const result = await queryConfig.queryFn!();
    
    expect(result[0].timestamp).toMatch(/^\d+m$/);
  });

  it('formatTimestampが正しく動作する（時間単位）', async () => {
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    
    const mockResponseData = {
      Items: [
        {
          id: 1,
          type: 'post',
          content: 'テスト投稿',
          user: {
            username: 'testuser',
            iconImage: '',
          },
          postedAt: twoHoursAgo.toISOString(),
          likeCount: 0,
          isLiked: false,
        },
      ],
    };

    mockGet.mockResolvedValue(mockResponseData);
    
    renderHook(() => useGetOwnerPosts('testuser'));
    
    const queryConfig = mockUseQuery.mock.calls[0][0];
    const result = await queryConfig.queryFn!();
    
    expect(result[0].timestamp).toMatch(/^\d+h$/);
  });

  it('formatTimestampが正しく動作する（日単位）', async () => {
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    
    const mockResponseData = {
      Items: [
        {
          id: 1,
          type: 'post',
          content: 'テスト投稿',
          user: {
            username: 'testuser',
            iconImage: '',
          },
          postedAt: twoDaysAgo.toISOString(),
          likeCount: 0,
          isLiked: false,
        },
      ],
    };

    mockGet.mockResolvedValue(mockResponseData);
    
    renderHook(() => useGetOwnerPosts('testuser'));
    
    const queryConfig = mockUseQuery.mock.calls[0][0];
    const result = await queryConfig.queryFn!();
    
    expect(result[0].timestamp).toMatch(/^\d+d$/);
  });

  it('handleが小文字で設定される', async () => {
    const mockResponseData = {
      Items: [
        {
          id: 1,
          type: 'post',
          content: 'テスト投稿',
          user: {
            username: 'TestUser',
            iconImage: '',
          },
          postedAt: '2024-01-01T12:00:00Z',
          likeCount: 0,
          isLiked: false,
        },
      ],
    };

    mockGet.mockResolvedValue(mockResponseData);
    
    renderHook(() => useGetOwnerPosts('testuser'));
    
    const queryConfig = mockUseQuery.mock.calls[0][0];
    const result = await queryConfig.queryFn!();
    
    expect(result[0].handle).toBe('testuser');
  });
});
