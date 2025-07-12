import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '../../../../test-utils';
import { usePost } from '../usePost';

vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
}));

vi.mock('@/api/methods', () => ({
  post: vi.fn(),
}));

import { useMutation } from '@tanstack/react-query';
import { post } from '@/api/methods';

describe('usePost', () => {
  const mockMutate = vi.fn();
  const mockPost = vi.mocked(post);
  const mockUseMutation = vi.mocked(useMutation);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
      data: null,
      isError: false,
      isSuccess: false,
      reset: vi.fn(),
      mutateAsync: vi.fn(),
      variables: undefined,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isIdle: true,
      status: 'idle',
      submittedAt: 0,
    });
  });

  it('usePostフックが正しく初期化される', () => {
    const { result } = renderHook(() => usePost());
    
    expect(result.current).toHaveProperty('mutate');
    expect(result.current).toHaveProperty('isPending');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('data');
    expect(mockUseMutation).toHaveBeenCalledWith({
      mutationFn: expect.any(Function),
      onSuccess: expect.any(Function),
      retry: 0,
    });
  });

  it('onSuccessコールバックが提供された場合に正しく設定される', () => {
    const mockOnSuccess = vi.fn();
    const { result } = renderHook(() => usePost(mockOnSuccess));
    
    expect(result.current).toHaveProperty('mutate');
    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(mockUseMutation).toHaveBeenCalledWith({
      mutationFn: expect.any(Function),
      onSuccess: expect.any(Function),
      retry: 0,
    });
  });

  it('mutationFnが正しくpostメソッドを呼び出す', async () => {
    mockPost.mockResolvedValue({ success: true });
    
    renderHook(() => usePost());
    
    const mutationConfig = mockUseMutation.mock.calls[0][0];
    const testData = { content: 'テスト投稿' };
    
    await mutationConfig.mutationFn(testData);
    
    expect(mockPost).toHaveBeenCalledWith('/api/posts', testData);
  });

  it('onSuccessコールバックが実行される', () => {
    const mockOnSuccess = vi.fn();
    
    renderHook(() => usePost(mockOnSuccess));
    
    const mutationConfig = mockUseMutation.mock.calls[0][0];
    mutationConfig.onSuccess();
    
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('onSuccessコールバックが未定義の場合でもエラーが発生しない', () => {
    renderHook(() => usePost());
    
    const mutationConfig = mockUseMutation.mock.calls[0][0];
    
    expect(() => mutationConfig.onSuccess()).not.toThrow();
  });
});
