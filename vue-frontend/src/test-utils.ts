import { mount, VueWrapper } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import { vi } from 'vitest'

const vuetify = createVuetify()

export function render(component: any, options: any = {}) {
  const { props = {}, ...mountOptions } = options
  
  return mount(component, {
    props,
    global: {
      plugins: [vuetify],
      stubs: {
        'router-link': true,
        'router-view': true,
      },
    },
    ...mountOptions,
  })
}

export const createMockFn: typeof vi.fn = vi.fn

export const nextTick = () => new Promise(resolve => setTimeout(resolve, 0))

export const findByText = (wrapper: VueWrapper<any>, text: string) => {
  return wrapper.find(`[data-testid*="${text}"], :contains("${text}")`)
}

export const fireEvent = {
  click: (element: any) => element.trigger('click'),
  input: (element: any, value: string) => element.setValue(value),
  submit: (element: any) => element.trigger('submit'),
}
