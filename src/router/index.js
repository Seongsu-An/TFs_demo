import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/Main.vue'
import EditorView from '../views/Editors.vue'

const routes = [
  {
    path: '/',
    name: 'main',
    component: MainView,
    beforeEnter: (to, from, next) => {
      //조건들
      next()
    },
    props: true
  },
  {
    path: '/editors',
    name: 'editors',
    component: EditorView,
    beforeEnter: (to, from, next) => {
      //조건들
      next()
    },
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'mainFilter',
    component: MainView,
    beforeEnter: (to, from, next) => {
      next('/')
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
