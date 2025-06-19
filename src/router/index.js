import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import CategoriesPage from '../views/CategoriesPage.vue'
import PopularPage from '../views/PopularPage.vue'
import CardDetail from '../views/CardDetail.vue'
import ProfilePage from '../views/ProfilePage.vue' // <-- Import ProfilePage

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/categories', component: CategoriesPage },
  { path: '/popular', component: PopularPage },
  { path: '/card/:id', component: CardDetail },
  { path: '/profile', component: ProfilePage }, // <-- Add profile route
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
