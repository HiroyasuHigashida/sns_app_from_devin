import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUpdatePost, useDeletePost } from '../usePostActions';
import { useMutation } from '@tanstack/react-query';
import { put, deleteRequest } from '../../../../api/methods';

vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
}));

vi.mock('../../../../api/methods', () => ({
  put: vi.fn(),
  deleteRequest: vi.fn(),
}));

describe('usePostActions', () => {
  const mockUseMutation = vi.mocked(useMutation);
  const mockPut = vi.mocked(put);
  const mockDeleteRequest = vi.mocked(deleteRequest);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useUpdatePost', () => {
    it('正しい設定でuseMutationを初期化する', () => {
      const mockMutationResult = {
        mutate: vi.fn(),
        isPending: false,
      };
      mockUseMutation.mockReturnValue(mockMutationResult as any);

      renderHook(() => useUpdatePost());

      expect(mockUseMutation).toHaveBeenCalledWith({
        mutationFn: expect.any(Function),
        onSuccess: expect.any(Function),
        retry: 0,
      });
    });

    it('mutationFnが正しいAPIエンドポイントを呼び出す', async () => {
      let capturedMutationFn: any;
      mockUseMutation.mockImplementation((config) => {
        capturedMutationFn = config.mutationFn;
        return { mutate: vi.fn(), isPending: false } as any;
      });

      mockPut.mockResolvedValue({ success: true });

      renderHook(() => useUpdatePost());

      await capturedMutationFn({ postId: 1, content: '更新された投稿' });

      expect(mockPut).toHaveBeenCalledWith('/api/posts/1', { content: '更新された投稿' });
    });

    it('onSuccessコールバックが提供された場合に呼び出される', () => {
      const mockOnSuccess = vi.fn();
      let capturedOnSuccess: any;

      mockUseMutation.mockImplementation((config) => {
        capturedOnSuccess = config.onSuccess;
        return { mutate: vi.fn(), isPending: false } as any;
      });

      renderHook(() => useUpdatePost(mockOnSuccess));

      act(() => {
        capturedOnSuccess();
      });

      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });

    it('onSuccessコールバックが提供されていない場合でもエラーが発生しない', () => {
      let capturedOnSuccess: any;

      mockUseMutation.mockImplementation((config) => {
        capturedOnSuccess = config.onSuccess;
        return { mutate: vi.fn(), isPending: false } as any;
      });

      renderHook(() => useUpdatePost());

      expect(() => {
        act(() => {
          capturedOnSuccess();
        });
      }).not.toThrow();
    });

    it('retryが0に設定される', () => {
      mockUseMutation.mockReturnValue({ mutate: vi.fn(), isPending: false } as any);

      renderHook(() => useUpdatePost());

      const config = mockUseMutation.mock.calls[0][0];
      expect(config.retry).toBe(0);
    });
  });

  describe('useDeletePost', () => {
    it('正しい設定でuseMutationを初期化する', () => {
      const mockMutationResult = {
        mutate: vi.fn(),
        isPending: false,
      };
      mockUseMutation.mockReturnValue(mockMutationResult as any);

      renderHook(() => useDeletePost());

      expect(mockUseMutation).toHaveBeenCalledWith({
        mutationFn: expect.any(Function),
        onSuccess: expect.any(Function),
        retry: 0,
      });
    });

    it('mutationFnが正しいAPIエンドポイントを呼び出す', async () => {
      let capturedMutationFn: any;
      mockUseMutation.mockImplementation((config) => {
        capturedMutationFn = config.mutationFn;
        return { mutate: vi.fn(), isPending: false } as any;
      });

      mockDeleteRequest.mockResolvedValue({ success: true });

      renderHook(() => useDeletePost());

      await capturedMutationFn(1);

      expect(mockDeleteRequest).toHaveBeenCalledWith('/api/posts/1');
    });

    it('onSuccessコールバックが提供された場合に呼び出される', () => {
      const mockOnSuccess = vi.fn();
      let capturedOnSuccess: any;

      mockUseMutation.mockImplementation((config) => {
        capturedOnSuccess = config.onSuccess;
        return { mutate: vi.fn(), isPending: false } as any;
      });

      renderHook(() => useDeletePost(mockOnSuccess));

      act(() => {
        capturedOnSuccess();
      });

      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });

    it('onSuccessコールバックが提供されていない場合でもエラーが発生しない', () => {
      let capturedOnSuccess: any;

      mockUseMutation.mockImplementation((config) => {
        capturedOnSuccess = config.onSuccess;
        return { mutate: vi.fn(), isPending: false } as any;
      });

      renderHook(() => useDeletePost());

      expect(() => {
        act(() => {
          capturedOnSuccess();
        });
      }).not.toThrow();
    });

    it('retryが0に設定される', () => {
      mockUseMutation.mockReturnValue({ mutate: vi.fn(), isPending: false } as any);

      renderHook(() => useDeletePost());

      const config = mockUseMutation.mock.calls[0][0];
      expect(config.retry).toBe(0);
    });
  });
});
