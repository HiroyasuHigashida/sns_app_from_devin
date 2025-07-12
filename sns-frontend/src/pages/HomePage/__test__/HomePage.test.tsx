import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test-utils';
import { HomePage } from '@/pages/HomePage';

describe('ホームページ', () => {
  it('現在使用されていないため何もレンダリングしない', () => {
    const { container } = render(<HomePage />);
    
    expect(container.firstChild).toBeNull();
  });

  it('SideNavやFeedコンポーネントはレンダリングされない', () => {
    render(<HomePage />);
    
    expect(screen.queryByTestId('side-nav')).not.toBeInTheDocument();
    expect(screen.queryByTestId('feed')).not.toBeInTheDocument();
  });
});         