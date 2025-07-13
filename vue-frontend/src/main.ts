import { createApp } from 'vue'
import { Amplify } from 'aws-amplify'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import App from './App.vue'
import './styles/global.css'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "ap-northeast-1_jDy6IO2m7",
      userPoolClientId: "3lns0hu13e34n00pdj2jotml9n", 
      identityPoolId: "ap-northeast-1:cbf6a159-d75e-4011-b3de-6de690266a53",
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: "code",
      userAttributes: {
        email: {
          required: true,
        },
      },
      allowGuestAccess: true,
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
})

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
  },
})

const app = createApp(App)

app.use(VueQueryPlugin)
app.use(vuetify)

app.mount('#app')
