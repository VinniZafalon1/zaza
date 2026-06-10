import { createRouter, createWebHistory } from '@ionic/vue-router'

import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import ResetPasswordPage from '@/views/ResetPassword.vue'

import AlbumPage from '@/views/AlbumPage.vue'
import CollectedPage from '@/views/CollectedPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import AboutPage from '@/views/AboutPage.vue'
import TermsPage from '@/views/TermsPage.vue'
import PrivacyPage from '@/views/PrivacyPage.vue'

import TabsPage from '@/views/TabsPage.vue'

import { useAuth } from '@/composables/useAuth'

const routes = [
  {
    path: '/',
    component: LoginPage
  },

  {
    path: '/register',
    component: RegisterPage
  },

  {
    path: '/reset-password',
    component: ResetPasswordPage
  },

  {
    path: '/tabs',
    component: TabsPage,

    beforeEnter: () => {
      const { currentUser } = useAuth()

      if (!currentUser.value) {
        return '/'
      }
    },

    children: [
      {
        path: '',
        redirect: '/tabs/album'
      },

      {
        path: 'album',
        component: AlbumPage
      },

      {
        path: 'collected',
        component: CollectedPage
      },

      {
        path: 'profile',
        component: ProfilePage
      },

      {
        path: 'about',
        component: AboutPage
      }
    ]
  },

  {
    path: '/terms',
    component: TermsPage
  },

  {
    path: '/privacy',
    component: PrivacyPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router