import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomePage } from '../HomePage';

// テストを簡略化するためのすべての子コンポーネントのモック
vi.mock('../../../modules/SideNav', () => ({
  SideNav: ({ activePage }: { activePage: string }) => (
    <div data-testid="side-nav">SideNav Component (Active: {activePage})</div>
  ),
}));

vi.mock('../../../modules/Feed', () => ({
  Feed: () => <div data-testid="feed">Feed Component</div>,
}));

// Material UIのuseMediaQueryフックのモック
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    useMediaQuery: vi.fn(),
  };
});

import { useMediaQuery } from '@mui/material';

describe('ホームページ', () => {
  it('デスクトップでSideNavとFeedの両方をレンダリングする', () => {
    // デスクトップレイアウトのモック
    vi.mocked(useMediaQuery).mockReturnValue(false);
    
    render(<HomePage />);
    expect(screen.getByTestId('side-nav')).toBeInTheDocument();
    expect(screen.getByText('SideNav Component (Active: home)')).toBeInTheDocument();
    expect(screen.getByTestId('feed')).toBeInTheDocument();
  });

  it('モバイルではFeedのみをレンダリングする', () => {
    // モバイルレイアウトのモック
    vi.mocked(useMediaQuery).mockReturnValue(true);
    
    render(<HomePage />);
    expect(screen.queryByTestId('side-nav')).not.toBeInTheDocument();
    expect(screen.getByTestId('feed')).toBeInTheDocument();
  });
}); 