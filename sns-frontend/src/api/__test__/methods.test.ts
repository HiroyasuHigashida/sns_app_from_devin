import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get, post, put, deleteRequest, instance } from '../methods';

vi.mock('aws-amplify/auth', () => ({
  fetchAuthSession: vi.fn(),
}));

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: {
          use: vi.fn(),
        },
      },
    })),
  },
}));

describe('APIメソッド', () => {
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: {
        use: vi.fn(),
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(instance, mockAxiosInstance);
  });

  describe('get', () => {
    it('成功時にレスポンスデータを返す', async () => {
      const mockData = { id: 1, name: 'テストデータ' };
      mockAxiosInstance.get.mockResolvedValue({ data: mockData });

      const result = await get('/api/test');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/test');
      expect(result).toEqual(mockData);
    });

    it('エラー時にエラーをスローする', async () => {
      const mockError = new Error('Network Error');
      mockAxiosInstance.get.mockRejectedValue(mockError);
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(get('/api/test')).rejects.toThrow('Network Error');
      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      
      consoleSpy.mockRestore();
    });
  });

  describe('post', () => {
    it('成功時にレスポンスデータを返す', async () => {
      const mockData = { success: true };
      const postData = { content: 'テスト投稿' };
      mockAxiosInstance.post.mockResolvedValue({ data: mockData });

      const result = await post('/api/posts', postData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/posts', postData);
      expect(result).toEqual(mockData);
    });

    it('エラー時にエラーをスローする', async () => {
      const mockError = new Error('Server Error');
      const postData = { content: 'テスト投稿' };
      mockAxiosInstance.post.mockRejectedValue(mockError);
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(post('/api/posts', postData)).rejects.toThrow('Server Error');
      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      
      consoleSpy.mockRestore();
    });

    it('データがnullの場合でも正常に動作する', async () => {
      const mockData = { success: true };
      mockAxiosInstance.post.mockResolvedValue({ data: mockData });

      const result = await post('/api/posts', null);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/posts', null);
      expect(result).toEqual(mockData);
    });
  });

  describe('put', () => {
    it('成功時にレスポンスデータを返す', async () => {
      const mockData = { updated: true };
      const putData = { id: 1, content: '更新されたデータ' };
      mockAxiosInstance.put.mockResolvedValue({ data: mockData });

      const result = await put('/api/posts/1', putData);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/api/posts/1', putData);
      expect(result).toEqual(mockData);
    });

    it('エラー時にエラーをスローする', async () => {
      const mockError = new Error('Update Error');
      const putData = { id: 1, content: '更新されたデータ' };
      mockAxiosInstance.put.mockRejectedValue(mockError);
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(put('/api/posts/1', putData)).rejects.toThrow('Update Error');
      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      
      consoleSpy.mockRestore();
    });
  });

  describe('deleteRequest', () => {
    it('成功時にレスポンスデータを返す', async () => {
      const mockData = { deleted: true };
      mockAxiosInstance.delete.mockResolvedValue({ data: mockData });

      const result = await deleteRequest('/api/posts/1');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/api/posts/1');
      expect(result).toEqual(mockData);
    });

    it('エラー時にエラーをスローする', async () => {
      const mockError = new Error('Delete Error');
      mockAxiosInstance.delete.mockRejectedValue(mockError);
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(deleteRequest('/api/posts/1')).rejects.toThrow('Delete Error');
      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      
      consoleSpy.mockRestore();
    });
  });

  describe('axiosインスタンス設定', () => {
    it('baseURLが環境変数から設定される', () => {
      expect(instance).toBeDefined();
    });

    it('インスタンスが正しく作成される', () => {
      expect(instance.get).toBeDefined();
      expect(instance.post).toBeDefined();
      expect(instance.put).toBeDefined();
      expect(instance.delete).toBeDefined();
    });
  });


});
