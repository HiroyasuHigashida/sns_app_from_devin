import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import PostForm from '@/modules/PostForm/PostForm.vue'
import { useCurrentUser } from '@/composables/useCurrentUser'

vi.mock('@/composables/useCurrentUser', () => ({
  useCurrentUser: vi.fn(),
}))

const vuetify = createVuetify()

describe('ポストフォーム', () => {
  beforeEach(() => {
    vi.mocked(useCurrentUser).mockReturnValue({
      user: { value: { username: 'testuser' } },
    } as any)
  })

  const mockProps = {
    onSubmit: vi.fn(),
    loading: false,
  }

  const createWrapper = (props = {}) => {
    return mount(PostForm, {
      props: { ...mockProps, ...props },
      global: {
        plugins: [vuetify],
      },
    })
  }

  it('テキストエリアが正しくレンダリングされる', () => {
    const wrapper = createWrapper()
    const textarea = wrapper.find('textarea')
    expect(textarea.exists()).toBe(true)
    expect(textarea.attributes('placeholder')).toBe('いまどうしてる？')
  })

  it('文字数カウンターが表示される', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('0/140')
  })

  it('テキスト入力時に文字数カウンターが更新される', async () => {
    const wrapper = createWrapper()
    const textarea = wrapper.find('textarea')
    
    await textarea.setValue('Hello World')
    expect(wrapper.text()).toContain('11/140')
  })

  it('140文字を超えた場合に送信ボタンが無効になる', async () => {
    const wrapper = createWrapper()
    const textarea = wrapper.find('textarea')
    const longText = 'a'.repeat(141)
    
    await textarea.setValue(longText)
    
    const submitButton = wrapper.find('[data-testid="submit-button"]')
    expect(submitButton.attributes('disabled')).toBeDefined()
  })

  it('空のテキストの場合に送信ボタンが無効になる', () => {
    const wrapper = createWrapper()
    const submitButton = wrapper.find('[data-testid="submit-button"]')
    expect(submitButton.attributes('disabled')).toBeDefined()
  })

  it('有効なテキストがある場合に送信ボタンが有効になる', async () => {
    const wrapper = createWrapper()
    const textarea = wrapper.find('textarea')
    
    await textarea.setValue('Valid post content')
    
    const submitButton = wrapper.find('[data-testid="submit-button"]')
    expect(submitButton.attributes('disabled')).toBeUndefined()
  })

  it('送信ボタンクリック時にonSubmitが呼び出される', async () => {
    const mockOnSubmit = vi.fn()
    const wrapper = createWrapper({ onSubmit: mockOnSubmit })
    const textarea = wrapper.find('textarea')
    
    await textarea.setValue('Test post')
    
    const submitButton = wrapper.find('[data-testid="submit-button"]')
    await submitButton.trigger('click')
    
    expect(mockOnSubmit).toHaveBeenCalledWith('Test post')
  })

  it('ローディング中は送信ボタンが無効になる', () => {
    const wrapper = createWrapper({ loading: true })
    const submitButton = wrapper.find('[data-testid="submit-button"]')
    expect(submitButton.attributes('disabled')).toBeDefined()
  })
})
