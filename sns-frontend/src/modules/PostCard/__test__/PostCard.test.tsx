import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PostCard } from '../PostCard';

describe('ポストカード', () => {
  const mockProps = {
    username: 'John Doe',
    handle: 'johndoe',
    content: 'This is a test post',
    timestamp: '2h',
    likes: 5,
    comments: 2,
    retweets: 1,
    onLike: vi.fn(),
    onComment: vi.fn(),
    onRetweet: vi.fn(),
    onShare: vi.fn(),
  };

  it('ポストのコンテンツとメタデータが正しくレンダリングされる', () => {
    render(<PostCard {...mockProps} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('@johndoe')).toBeInTheDocument();
    expect(screen.getByText('This is a test post')).toBeInTheDocument();
    expect(screen.getByText('2h')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('正しいalt textでアバターがレンダリングされる', () => {
    render(<PostCard {...mockProps} />);
    expect(screen.getByLabelText('John Doe')).toBeInTheDocument();
  });

  it('いいねされていない場合、お気に入りの枠線アイコンが表示される', () => {
    render(<PostCard {...mockProps} isLiked={false} />);
    expect(screen.getByLabelText('like')).toBeInTheDocument();
  });

  it('いいねされている場合、塗りつぶされたお気に入りアイコンが表示される', () => {
    render(<PostCard {...mockProps} isLiked={true} />);
    expect(screen.getByLabelText('like')).toBeInTheDocument();
  });

  it('いいねボタンがクリックされたときにonLikeが呼び出される', () => {
    render(<PostCard {...mockProps} />);
    fireEvent.click(screen.getByLabelText('like'));
    expect(mockProps.onLike).toHaveBeenCalledTimes(1);
  });

  it('コメントボタンがクリックされたときにonCommentが呼び出される', () => {
    render(<PostCard {...mockProps} />);
    fireEvent.click(screen.getByLabelText('comment'));
    expect(mockProps.onComment).toHaveBeenCalledTimes(1);
  });

  it('リツイートボタンがクリックされたときにonRetweetが呼び出される', () => {
    render(<PostCard {...mockProps} />);
    fireEvent.click(screen.getByLabelText('retweet'));
    expect(mockProps.onRetweet).toHaveBeenCalledTimes(1);
  });

  it('シェアボタンがクリックされたときにonShareが呼び出される', () => {
    render(<PostCard {...mockProps} />);
    fireEvent.click(screen.getByLabelText('share'));
    expect(mockProps.onShare).toHaveBeenCalledTimes(1);
  });
}); 