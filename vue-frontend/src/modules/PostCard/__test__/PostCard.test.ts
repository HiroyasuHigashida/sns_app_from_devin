import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import PostCard from '@/modules/PostCard/PostCard.vue'
import { useCurrentUser } from '@/composables/useCurrentUser'

vi.mock('@/composables/useCurrentUser', () => ({
  useCurrentUser: vi.fn(),
}))

const vuetify = createVuetify()

describe('ポストカード', () => {
  beforeEach(() => {
    vi.mocked(useCurrentUser).mockReturnValue({
      user: { value: { username: 'testuser' } },
      isOwner: vi.fn(() => false),
    } as any)
  })

  const mockProps = {
    id: 1,
    username: 'John Doe',
    handle: 'johndoe',
    content: 'This is a test post',
    timestamp: '2h',
    likes: 5,
    comments: 2,
    retweets: 1,
    isLiked: false,
    onLike: vi.fn(),
    onComment: vi.fn(),
    onRetweet: vi.fn(),
    onShare: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  }

  const createWrapper = (props = {}) => {
    return mount(PostCard, {
      props: { ...mockProps, ...props },
      global: {
        plugins: [vuetify],
      },
    })
  }

  it('ポストのコンテンツとメタデータが正しくレンダリングされる', () => {
    const wrapper = createWrapper()
    
    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('@johndoe')
    expect(wrapper.text()).toContain('This is a test post')
    expect(wrapper.text()).toContain('2h')
    expect(wrapper.text()).toContain('5')
    expect(wrapper.text()).toContain('2')
    expect(wrapper.text()).toContain('1')
  })

  it('いいねボタンがクリックされたときにonLikeが呼び出される', async () => {
    const mockOnLike = vi.fn()
    const wrapper = createWrapper({ onLike: mockOnLike })
    
    const likeButton = wrapper.find('[data-testid="like-button"]')
    await likeButton.trigger('click')
    
    expect(mockOnLike).toHaveBeenCalledTimes(1)
  })

  it('コメントボタンがクリックされたときにonCommentが呼び出される', async () => {
    const mockOnComment = vi.fn()
    const wrapper = createWrapper({ onComment: mockOnComment })
    
    const commentButton = wrapper.find('[data-testid="comment-button"]')
    await commentButton.trigger('click')
    
    expect(mockOnComment).toHaveBeenCalledTimes(1)
  })

  it('リツイートボタンがクリックされたときにonRetweetが呼び出される', async () => {
    const mockOnRetweet = vi.fn()
    const wrapper = createWrapper({ onRetweet: mockOnRetweet })
    
    const retweetButton = wrapper.find('[data-testid="retweet-button"]')
    await retweetButton.trigger('click')
    
    expect(mockOnRetweet).toHaveBeenCalledTimes(1)
  })

  it('シェアボタンがクリックされたときにonShareが呼び出される', async () => {
    const mockOnShare = vi.fn()
    const wrapper = createWrapper({ onShare: mockOnShare })
    
    const shareButton = wrapper.find('[data-testid="share-button"]')
    await shareButton.trigger('click')
    
    expect(mockOnShare).toHaveBeenCalledTimes(1)
  })

  it('投稿者が自分の場合にメニューボタンが表示される', () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      user: { value: { username: 'John Doe' } },
      isOwner: vi.fn(() => true),
    } as any)

    const wrapper = createWrapper()
    const menuButton = wrapper.find('[data-testid="menu-button"]')
    expect(menuButton.exists()).toBe(true)
  })

  it('いいねされていない場合、お気に入りの枠線アイコンが表示される', () => {
    const wrapper = createWrapper({ isLiked: false })
    const likeIcon = wrapper.find('[data-testid="like-icon-outline"]')
    expect(likeIcon.exists()).toBe(true)
  })

  it('いいねされている場合、塗りつぶされたお気に入りアイコンが表示される', () => {
    const wrapper = createWrapper({ isLiked: true })
    const likeIcon = wrapper.find('[data-testid="like-icon-filled"]')
    expect(likeIcon.exists()).toBe(true)
  })

  it('isLikedプロパティが未定義の場合にデフォルト値falseが使用される', () => {
    const wrapper = createWrapper({ isLiked: undefined })
    const likeIcon = wrapper.find('[data-testid="like-icon-outline"]')
    expect(likeIcon.exists()).toBe(true)
  })
})
