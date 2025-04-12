import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import SignupPage from '../views/SignupPage.vue';
import DashboardPage from '../views/DashboardPage.vue';

const routes = [
  { path: '/', component: LoginPage },
  { path: '/signup', component: SignupPage },
  { path: '/dashboard', component: DashboardPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
