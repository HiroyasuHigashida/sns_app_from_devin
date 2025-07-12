import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGetProfile, useUpdateProfile, useGetIcon, useUpdateIcon } from '../useProfile';
import { useQuery, useMutation } from '@tanstack/react-query';
import { get, put } from '../../../../api/methods';

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

vi.mock('../../../../api/methods', () => ({
  get: vi.fn(),
  put: vi.fn(),
}));

describe('useProfile', () => {
  const mockUseQuery = vi.mocked(useQuery);
  const mockUseMutation = vi.mocked(useMutation);
  const mockGet = vi.mocked(get);
  const mockPut = vi.mocked(put);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useGetProfile', () => {
    it('正しいクエリキーでuseQueryを初期化する', () => {
      mockUseQuery.mockReturnValue({} as any);

      renderHook(() => useGetProfile('testuser'));

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['profile', 'testuser'],
        queryFn: expect.any(Function),
        retry: 0,
      });
    });

    it('queryFnが正しいAPIエンドポイントを呼び出す', async () => {
      let capturedQueryFn: any;
      mockUseQuery.mockImplementation((config) => {
        capturedQueryFn = config.queryFn;
        return {} as any;
      });

      const mockProfileResponse = { profile: 'テストプロフィール' };
      mockGet.mockResolvedValue(mockProfileResponse);

      renderHook(() => useGetProfile('testuser'));

      const result = await capturedQueryFn();

      expect(mockGet).toHaveBeenCalledWith('/api/profiles/testuser');
      expect(result).toEqual(mockProfileResponse);
    });

    it('retryが0に設定される', () => {
      mockUseQuery.mockReturnValue({} as any);

      renderHook(() => useGetProfile('testuser'));

      const config = mockUseQuery.mock.calls[0][0];
      expect(config.retry).toBe(0);
    });
  });

  describe('useUpdateProfile', () => {
    it('正しい設定でuseMutationを初期化する', () => {
      const mockMutationResult = {
        mutate: vi.fn(),
        isPending: false,
      };
      mockUseMutation.mockReturnValue(mockMutationResult as any);

      renderHook(() => useUpdateProfile());

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

      renderHook(() => useUpdateProfile());

      await capturedMutationFn('更新されたプロフィール');

      expect(mockPut).toHaveBeenCalledWith('/api/profiles', { profile: '更新されたプロフィール' });
    });

    it('onSuccessコールバックが提供された場合に呼び出される', () => {
      const mockOnSuccess = vi.fn();
      let capturedOnSuccess: any;

      mockUseMutation.mockImplementation((config) => {
        capturedOnSuccess = config.onSuccess;
        return { mutate: vi.fn(), isPending: false } as any;
      });

      renderHook(() => useUpdateProfile(mockOnSuccess));

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

      renderHook(() => useUpdateProfile());

      expect(() => {
        act(() => {
          capturedOnSuccess();
        });
      }).not.toThrow();
    });

    it('retryが0に設定される', () => {
      mockUseMutation.mockReturnValue({ mutate: vi.fn(), isPending: false } as any);

      renderHook(() => useUpdateProfile());

      const config = mockUseMutation.mock.calls[0][0];
      expect(config.retry).toBe(0);
    });
  });

  describe('useGetIcon', () => {
    it('正しいクエリキーでuseQueryを初期化する', () => {
      mockUseQuery.mockReturnValue({} as any);

      renderHook(() => useGetIcon('testuser'));

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['icon', 'testuser'],
        queryFn: expect.any(Function),
        retry: 0,
      });
    });

    it('queryFnが正しいAPIエンドポイントを呼び出す', async () => {
      let capturedQueryFn: any;
      mockUseQuery.mockImplementation((config) => {
        capturedQueryFn = config.queryFn;
        return {} as any;
      });

      const mockIconResponse = { iconImage: 'test-icon.jpg' };
      mockGet.mockResolvedValue(mockIconResponse);

      renderHook(() => useGetIcon('testuser'));

      const result = await capturedQueryFn();

      expect(mockGet).toHaveBeenCalledWith('/api/icons/testuser');
      expect(result).toEqual(mockIconResponse);
    });

    it('retryが0に設定される', () => {
      mockUseQuery.mockReturnValue({} as any);

      renderHook(() => useGetIcon('testuser'));

      const config = mockUseQuery.mock.calls[0][0];
      expect(config.retry).toBe(0);
    });
  });

  describe('useUpdateIcon', () => {
    it('正しい設定でuseMutationを初期化する', () => {
      const mockMutationResult = {
        mutate: vi.fn(),
        isPending: false,
      };
      mockUseMutation.mockReturnValue(mockMutationResult as any);

      renderHook(() => useUpdateIcon());

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

      renderHook(() => useUpdateIcon());

      await capturedMutationFn('updated-icon.jpg');

      expect(mockPut).toHaveBeenCalledWith('/api/icons', { iconImage: 'updated-icon.jpg' });
    });

    it('onSuccessコールバックが提供された場合に呼び出される', () => {
      const mockOnSuccess = vi.fn();
      let capturedOnSuccess: any;

      mockUseMutation.mockImplementation((config) => {
        capturedOnSuccess = config.onSuccess;
        return { mutate: vi.fn(), isPending: false } as any;
      });

      renderHook(() => useUpdateIcon(mockOnSuccess));

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

      renderHook(() => useUpdateIcon());

      expect(() => {
        act(() => {
          capturedOnSuccess();
        });
      }).not.toThrow();
    });

    it('retryが0に設定される', () => {
      mockUseMutation.mockReturnValue({ mutate: vi.fn(), isPending: false } as any);

      renderHook(() => useUpdateIcon());

      const config = mockUseMutation.mock.calls[0][0];
      expect(config.retry).toBe(0);
    });
  });
});
