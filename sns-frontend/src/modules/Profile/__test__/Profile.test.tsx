import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../../test-utils';
import { Profile } from '../Profile';

vi.mock('../../UserProfile/api/useProfile', () => ({
  useGetProfile: vi.fn(),
  useUpdateProfile: vi.fn(),
  useGetIcon: vi.fn(),
  useUpdateIcon: vi.fn(),
}));

vi.mock('../../Feed/api/useGetOwnerPosts', () => ({
  useGetOwnerPosts: vi.fn(),
}));

vi.mock('../../PostCard', () => ({
  PostCard: ({ username, content }: { username: string; content: string }) => (
    <div data-testid="post-card">
      Post by {username}: {content}
    </div>
  ),
}));

vi.mock('@aws-amplify/ui-react', () => ({
  useAuthenticator: vi.fn(),
}));

import { useGetProfile, useUpdateProfile, useGetIcon, useUpdateIcon } from '../../UserProfile/api/useProfile';
import { useGetOwnerPosts } from '../../Feed/api/useGetOwnerPosts';
import { useAuthenticator } from '@aws-amplify/ui-react';

describe('プロフィール', () => {
  const mockProfileData = {
    profile: 'テストプロフィール',
  };

  const mockIconData = {
    iconImage: 'data:image/png;base64,test',
  };

  const mockPosts = [
    {
      id: 1,
      username: 'testuser',
      handle: '@testuser',
      avatar: 'avatar1.jpg',
      content: 'テスト投稿1',
      timestamp: '2024-01-01T00:00:00Z',
      likes: 5,
      comments: 2,
      retweets: 1,
      isLiked: false,
    },
    {
      id: 2,
      username: 'testuser',
      handle: '@testuser',
      avatar: 'avatar2.jpg',
      content: 'テスト投稿2',
      timestamp: '2024-01-02T00:00:00Z',
      likes: 3,
      comments: 1,
      retweets: 0,
      isLiked: true,
    },
  ];

  const mockRefetch = vi.fn();
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(useAuthenticator).mockReturnValue({
      user: { username: 'testuser' },
    } as any);
    
    vi.mocked(useGetProfile).mockReturnValue({
      data: mockProfileData,
      refetch: mockRefetch,
      isLoading: false,
      error: null,
    } as any);
    
    vi.mocked(useGetIcon).mockReturnValue({
      data: mockIconData,
      refetch: mockRefetch,
      isLoading: false,
      error: null,
    } as any);
    
    vi.mocked(useGetOwnerPosts).mockReturnValue({
      data: mockPosts,
      isLoading: false,
      error: null,
    } as any);
    
    vi.mocked(useUpdateProfile).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      error: null,
    } as any);
    
    vi.mocked(useUpdateIcon).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      error: null,
    } as any);
  });


  it('自分のプロフィールが正しく表示される', () => {
    render(<Profile />);
    
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('@testuser')).toBeInTheDocument();
    expect(screen.getByText('テストプロフィール')).toBeInTheDocument();
    expect(screen.getByText('投稿 (2)')).toBeInTheDocument();
  });

  it('他のユーザーのプロフィールが正しく表示される', () => {
    render(<Profile username="otheruser" />);
    
    expect(screen.getByText('otheruser')).toBeInTheDocument();
    expect(screen.getByText('@otheruser')).toBeInTheDocument();
  });

  it('プロフィールが設定されていない場合にデフォルトメッセージを表示する', () => {
    vi.mocked(useGetProfile).mockReturnValue({
      data: { profile: '' },
      refetch: mockRefetch,
      isLoading: false,
      error: null,
    } as any);
    
    render(<Profile />);
    
    expect(screen.getByText('プロフィールが設定されていません')).toBeInTheDocument();
  });

  it('自分のプロフィールの場合に編集ボタンが表示される', () => {
    render(<Profile />);
    
    expect(screen.getByText('プロフィールを編集')).toBeInTheDocument();
  });

  it('他のユーザーのプロフィールの場合に編集ボタンが表示されない', () => {
    render(<Profile username="otheruser" />);
    
    expect(screen.queryByText('プロフィールを編集')).not.toBeInTheDocument();
  });

  it('編集ボタンをクリックすると編集モードになる', () => {
    render(<Profile />);
    
    fireEvent.click(screen.getByText('プロフィールを編集'));
    
    expect(screen.getByDisplayValue('テストプロフィール')).toBeInTheDocument();
    expect(screen.getByText('保存')).toBeInTheDocument();
    expect(screen.getByText('キャンセル')).toBeInTheDocument();
  });

  it('編集モードでプロフィールテキストを変更できる', () => {
    render(<Profile />);
    
    fireEvent.click(screen.getByText('プロフィールを編集'));
    
    const textField = screen.getByDisplayValue('テストプロフィール');
    fireEvent.change(textField, { target: { value: '新しいプロフィール' } });
    
    expect(screen.getByDisplayValue('新しいプロフィール')).toBeInTheDocument();
  });

  it('保存ボタンをクリックするとプロフィールが更新される', () => {
    render(<Profile />);
    
    fireEvent.click(screen.getByText('プロフィールを編集'));
    
    const textField = screen.getByDisplayValue('テストプロフィール');
    fireEvent.change(textField, { target: { value: '新しいプロフィール' } });
    
    fireEvent.click(screen.getByText('保存'));
    
    expect(mockMutate).toHaveBeenCalledWith('新しいプロフィール');
  });

  it('キャンセルボタンをクリックすると編集モードが終了する', () => {
    render(<Profile />);
    
    fireEvent.click(screen.getByText('プロフィールを編集'));
    fireEvent.click(screen.getByText('キャンセル'));
    
    expect(screen.queryByDisplayValue('テストプロフィール')).not.toBeInTheDocument();
    expect(screen.getByText('プロフィールを編集')).toBeInTheDocument();
  });

  it('投稿が正しく表示される', () => {
    render(<Profile />);
    
    expect(screen.getByText('Post by testuser: テスト投稿1')).toBeInTheDocument();
    expect(screen.getByText('Post by testuser: テスト投稿2')).toBeInTheDocument();
  });

  it('投稿がない場合にメッセージを表示する', () => {
    vi.mocked(useGetOwnerPosts).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any);
    
    render(<Profile />);
    
    expect(screen.getByText('まだ投稿がありません')).toBeInTheDocument();
    expect(screen.getByText('投稿 (0)')).toBeInTheDocument();
  });

  it('投稿データがundefinedの場合にメッセージを表示する', () => {
    vi.mocked(useGetOwnerPosts).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    } as any);
    
    render(<Profile />);
    
    expect(screen.getByText('まだ投稿がありません')).toBeInTheDocument();
    expect(screen.getByText('投稿 (0)')).toBeInTheDocument();
  });

  it('更新中は保存ボタンが無効になる', () => {
    vi.mocked(useUpdateProfile).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      isError: false,
      error: null,
    } as any);
    
    render(<Profile />);
    
    fireEvent.click(screen.getByText('プロフィールを編集'));
    
    const saveButton = screen.getByText('保存');
    expect(saveButton).toBeDisabled();
  });

  it('アイコンが正しく表示される', () => {
    render(<Profile />);
    
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', 'data:image/png;base64,test');
  });

  it('アイコンがない場合にデフォルトアイコンを表示する', () => {
    vi.mocked(useGetIcon).mockReturnValue({
      data: { iconImage: null },
      refetch: mockRefetch,
      isLoading: false,
      error: null,
    } as any);
    
    render(<Profile />);
    
    expect(screen.getByTestId('PersonIcon')).toBeInTheDocument();
  });

  it('プロフィール更新後にコールバックが実行される', () => {
    let updateCallback: (() => void) | undefined;
    
    vi.mocked(useUpdateProfile).mockImplementation((callback) => {
      updateCallback = callback;
      return {
        mutate: mockMutate,
        isPending: false,
        isError: false,
        error: null,
      } as any;
    });
    
    render(<Profile />);
    
    fireEvent.click(screen.getByText('プロフィールを編集'));
    
    const textField = screen.getByDisplayValue('テストプロフィール');
    fireEvent.change(textField, { target: { value: '更新されたプロフィール' } });
    
    fireEvent.click(screen.getByText('保存'));
    
    if (updateCallback) {
      updateCallback();
    }
    
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('アイコン更新後にコールバックが実行される', () => {
    let updateIconCallback: (() => void) | undefined;
    
    vi.mocked(useUpdateIcon).mockImplementation((callback) => {
      updateIconCallback = callback;
      return {
        mutate: mockMutate,
        isPending: false,
        isError: false,
        error: null,
      } as any;
    });
    
    render(<Profile />);
    
    const fileInput = document.querySelector('#icon-upload') as HTMLInputElement;
    
    const mockFileReader = {
      readAsDataURL: vi.fn(),
      onload: null as any,
      result: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
    };
    
    global.FileReader = vi.fn(() => mockFileReader) as any;
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    if (mockFileReader.onload) {
      mockFileReader.onload({ target: { result: mockFileReader.result } } as any);
    }
    
    if (updateIconCallback) {
      updateIconCallback();
    }
    
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('ユーザーがnullの場合にエラーメッセージを表示する', () => {
    vi.mocked(useAuthenticator).mockReturnValue({
      user: null,
    } as any);
    
    render(<Profile />);
    
    expect(screen.getByText('ユーザーが見つかりません')).toBeInTheDocument();
  });

  it('他のユーザーのプロフィールを表示する場合にアイコン編集ボタンを非表示にする', () => {
    render(<Profile username="otheruser" />);
    
    expect(screen.queryByLabelText('icon-upload')).not.toBeInTheDocument();
  });

  it('ファイル入力要素が存在する', () => {
    render(<Profile />);
    
    const fileInput = screen.getByLabelText('', { selector: 'input[type="file"]' });
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute('accept', 'image/*');
  });

  it('ファイルアップロード時にファイルが選択されていない場合は何もしない', () => {
    const mockUpdateIcon = vi.fn();
    vi.mocked(useUpdateIcon).mockReturnValue({
      mutate: mockUpdateIcon,
      isPending: false,
    } as any);

    render(<Profile />);
    
    const fileInput = screen.getByLabelText('', { selector: 'input[type="file"]' });
    
    Object.defineProperty(fileInput, 'files', {
      value: [],
      writable: false,
    });

    fireEvent.change(fileInput);

    expect(mockUpdateIcon).not.toHaveBeenCalled();
  });

  it('プロフィール編集ボタンをクリックするとhandleEditClickが呼び出される', () => {
    const mockProfileData = { profile: 'テストプロフィール' };
    vi.mocked(useGetProfile).mockReturnValue({
      data: mockProfileData,
      refetch: vi.fn(),
    } as any);

    render(<Profile />);
    
    const editButton = screen.getByText('プロフィールを編集');
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('テストプロフィール')).toBeInTheDocument();
    expect(screen.getByText('保存')).toBeInTheDocument();
    expect(screen.getByText('キャンセル')).toBeInTheDocument();
  });

  it('プロフィールデータがnullまたは空の場合のhandleEditClick', () => {
    vi.mocked(useGetProfile).mockReturnValue({
      data: null,
      refetch: vi.fn(),
    } as any);

    render(<Profile />);
    
    const editButton = screen.getByText('プロフィールを編集');
    fireEvent.click(editButton);
    
    const textarea = screen.getByPlaceholderText('プロフィールを入力してください');
    expect(textarea).toHaveValue('');
    expect(screen.getByText('保存')).toBeInTheDocument();
    expect(screen.getByText('キャンセル')).toBeInTheDocument();
  });
});
