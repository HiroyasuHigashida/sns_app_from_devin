import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGetPost, formatTimestamp } from '../useGetPost';
import { useQuery } from '@tanstack/react-query';
import { get } from '../../../../api/methods';

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

vi.mock('../../../../api/methods', () => ({
  get: vi.fn(),
}));

describe('useGetPost', () => {
  const mockUseQuery = vi.mocked(useQuery);
  const mockGet = vi.mocked(get);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('正しいクエリキーでuseQueryを初期化する', () => {
    mockUseQuery.mockReturnValue({} as any);

    useGetPost();

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ['posts', undefined, undefined],
      queryFn: expect.any(Function),
      retry: 0,
    });
  });

  it('offsetとlimitパラメータを含むクエリキーでuseQueryを初期化する', () => {
    mockUseQuery.mockReturnValue({} as any);

    useGetPost(10, 20);

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ['posts', 10, 20],
      queryFn: expect.any(Function),
      retry: 0,
    });
  });

  it('retryが0に設定される', () => {
    mockUseQuery.mockReturnValue({} as any);

    useGetPost();

    const queryConfig = mockUseQuery.mock.calls[0][0];
    expect(queryConfig.retry).toBe(0);
  });

  it('queryFnがoffsetとlimitなしでAPIを呼び出す', async () => {
    let capturedQueryFn: any;
    mockUseQuery.mockImplementation((config) => {
      capturedQueryFn = config.queryFn;
      return {} as any;
    });

    const mockApiResponse = {
      Items: [
        {
          id: 1,
          type: 'post',
          content: 'テスト投稿1',
          user: { username: 'user1', iconImage: 'icon1.jpg' },
          postedAt: '2023-01-01T12:00:00Z',
          likeCount: 5,
          isLiked: false,
        },
        {
          id: 2,
          type: 'post',
          content: 'テスト投稿2',
          user: { username: 'user2', iconImage: '' },
          postedAt: '2023-01-01T11:00:00Z',
          likeCount: 3,
          isLiked: true,
        },
      ],
    };

    mockGet.mockResolvedValue(mockApiResponse);

    renderHook(() => useGetPost());

    const result = await capturedQueryFn();

    expect(mockGet).toHaveBeenCalledWith('/api/posts');
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: 1,
      username: 'user1',
      handle: 'user1',
      avatar: 'icon1.jpg',
      content: 'テスト投稿1',
      timestamp: expect.any(String),
      likes: 5,
      comments: 0,
      retweets: 0,
      isLiked: false,
    });
    expect(result[1]).toEqual({
      id: 2,
      username: 'user2',
      handle: 'user2',
      avatar: '',
      content: 'テスト投稿2',
      timestamp: expect.any(String),
      likes: 3,
      comments: 0,
      retweets: 0,
      isLiked: true,
    });
  });

  it('queryFnがoffsetとlimitありでAPIを呼び出す', async () => {
    let capturedQueryFn: any;
    mockUseQuery.mockImplementation((config) => {
      capturedQueryFn = config.queryFn;
      return {} as any;
    });

    const mockApiResponse = { Items: [] };
    mockGet.mockResolvedValue(mockApiResponse);

    renderHook(() => useGetPost(10, 20));

    await capturedQueryFn();

    expect(mockGet).toHaveBeenCalledWith('/api/posts?offset=10&limit=20');
  });

  it('queryFnがoffsetのみでAPIを呼び出す', async () => {
    let capturedQueryFn: any;
    mockUseQuery.mockImplementation((config) => {
      capturedQueryFn = config.queryFn;
      return {} as any;
    });

    const mockApiResponse = { Items: [] };
    mockGet.mockResolvedValue(mockApiResponse);

    renderHook(() => useGetPost(5));

    await capturedQueryFn();

    expect(mockGet).toHaveBeenCalledWith('/api/posts?offset=5');
  });

  it('queryFnがlimitのみでAPIを呼び出す', async () => {
    let capturedQueryFn: any;
    mockUseQuery.mockImplementation((config) => {
      capturedQueryFn = config.queryFn;
      return {} as any;
    });

    const mockApiResponse = { Items: [] };
    mockGet.mockResolvedValue(mockApiResponse);

    renderHook(() => useGetPost(undefined, 15));

    await capturedQueryFn();

    expect(mockGet).toHaveBeenCalledWith('/api/posts?limit=15');
  });

  it('投稿が時間で降順にソートされる', async () => {
    let capturedQueryFn: any;
    mockUseQuery.mockImplementation((config) => {
      capturedQueryFn = config.queryFn;
      return {} as any;
    });

    const mockApiResponse = {
      Items: [
        {
          id: 1,
          type: 'post',
          content: '古い投稿',
          user: { username: 'user1', iconImage: '' },
          postedAt: '2023-01-01T10:00:00Z',
          likeCount: 0,
          isLiked: false,
        },
        {
          id: 2,
          type: 'post',
          content: '新しい投稿',
          user: { username: 'user2', iconImage: '' },
          postedAt: '2023-01-01T12:00:00Z',
          likeCount: 0,
          isLiked: false,
        },
      ],
    };

    mockGet.mockResolvedValue(mockApiResponse);

    renderHook(() => useGetPost());

    const result = await capturedQueryFn();

    expect(result[0].content).toBe('新しい投稿');
    expect(result[1].content).toBe('古い投稿');
  });

  it('アイコンが空の場合に空文字列が設定される', async () => {
    let capturedQueryFn: any;
    mockUseQuery.mockImplementation((config) => {
      capturedQueryFn = config.queryFn;
      return {} as any;
    });

    const mockApiResponse = {
      Items: [
        {
          id: 1,
          type: 'post',
          content: 'テスト投稿',
          user: { username: 'user1', iconImage: null },
          postedAt: '2023-01-01T12:00:00Z',
          likeCount: 0,
          isLiked: false,
        },
      ],
    };

    mockGet.mockResolvedValue(mockApiResponse);

    renderHook(() => useGetPost());

    const result = await capturedQueryFn();

    expect(result[0].avatar).toBe('');
  });

  it('handleが小文字のusernameに変換される', async () => {
    let capturedQueryFn: any;
    mockUseQuery.mockImplementation((config) => {
      capturedQueryFn = config.queryFn;
      return {} as any;
    });

    const mockApiResponse = {
      Items: [
        {
          id: 1,
          type: 'post',
          content: 'テスト投稿',
          user: { username: 'TestUser', iconImage: '' },
          postedAt: '2023-01-01T12:00:00Z',
          likeCount: 0,
          isLiked: false,
        },
      ],
    };

    mockGet.mockResolvedValue(mockApiResponse);

    renderHook(() => useGetPost());

    const result = await capturedQueryFn();

    expect(result[0].username).toBe('TestUser');
    expect(result[0].handle).toBe('testuser');
  });

  it('formatTimestampが正しく呼び出される', async () => {
    let capturedQueryFn: any;
    mockUseQuery.mockImplementation((config) => {
      capturedQueryFn = config.queryFn;
      return {} as any;
    });

    const mockApiResponse = {
      Items: [
        {
          id: 1,
          type: 'post',
          content: 'テスト投稿',
          user: { username: 'user1', iconImage: '' },
          postedAt: '2023-01-01T12:00:00Z',
          likeCount: 0,
          isLiked: false,
        },
      ],
    };

    mockGet.mockResolvedValue(mockApiResponse);

    renderHook(() => useGetPost());

    const result = await capturedQueryFn();

    expect(typeof result[0].timestamp).toBe('string');
  });
});

describe('formatTimestamp', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-01-01T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('未来の時間の場合「未来」を返す', () => {
    const futureTime = new Date('2023-01-01T13:00:00Z').getTime();
    const result = formatTimestamp(futureTime);
    expect(result).toBe('未来');
  });

  it('0秒前の場合「たった今」を返す', () => {
    const now = new Date('2023-01-01T12:00:00Z').getTime();
    const result = formatTimestamp(now);
    expect(result).toBe('たった今');
  });

  it('30秒前の場合「30秒前」を返す', () => {
    const thirtySecondsAgo = new Date('2023-01-01T11:59:30Z').getTime();
    const result = formatTimestamp(thirtySecondsAgo);
    expect(result).toBe('30秒前');
  });

  it('30分前の場合「30分前」を返す', () => {
    const thirtyMinutesAgo = new Date('2023-01-01T11:30:00Z').getTime();
    const result = formatTimestamp(thirtyMinutesAgo);
    expect(result).toBe('30分前');
  });

  it('5時間前の場合「5時間前」を返す', () => {
    const fiveHoursAgo = new Date('2023-01-01T07:00:00Z').getTime();
    const result = formatTimestamp(fiveHoursAgo);
    expect(result).toBe('5時間前');
  });

  it('2日前の場合「YYYY/MM/DD」形式を返す', () => {
    const twoDaysAgo = new Date('2022-12-30T12:00:00Z').getTime();
    const result = formatTimestamp(twoDaysAgo);
    expect(result).toBe('2022/12/30');
  });

  it('文字列のタイムスタンプを正しく処理する', () => {
    const dateString = '2023-01-01T11:59:30Z';
    const result = formatTimestamp(dateString);
    expect(result).toBe('30秒前');
  });

  it('秒単位のタイムスタンプ（10桁）をミリ秒に変換する', () => {
    const secondsTimestamp = Math.floor(new Date('2023-01-01T11:59:30Z').getTime() / 1000);
    const result = formatTimestamp(secondsTimestamp);
    expect(result).toBe('30秒前');
  });

  it('ミリ秒単位のタイムスタンプ（13桁）をそのまま処理する', () => {
    const millisecondsTimestamp = new Date('2023-01-01T11:59:30Z').getTime();
    const result = formatTimestamp(millisecondsTimestamp);
    expect(result).toBe('30秒前');
  });

  it('1分ちょうどの場合「1分前」を返す', () => {
    const oneMinuteAgo = new Date('2023-01-01T11:59:00Z').getTime();
    const result = formatTimestamp(oneMinuteAgo);
    expect(result).toBe('1分前');
  });

  it('1時間ちょうどの場合「1時間前」を返す', () => {
    const oneHourAgo = new Date('2023-01-01T11:00:00Z').getTime();
    const result = formatTimestamp(oneHourAgo);
    expect(result).toBe('1時間前');
  });

  it('1日ちょうどの場合「YYYY/MM/DD」形式を返す', () => {
    const oneDayAgo = new Date('2022-12-31T12:00:00Z').getTime();
    const result = formatTimestamp(oneDayAgo);
    expect(result).toBe('2022/12/31');
  });

  it('月と日が1桁の場合、0埋めして表示する', () => {
    const dateWithSingleDigits = new Date('2022-02-03T12:00:00Z').getTime();
    const result = formatTimestamp(dateWithSingleDigits);
    expect(result).toBe('2022/02/03');
  });
});
