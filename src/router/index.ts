import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/auth/login',
    },
    {
      path: '/auth/login',
      component: () => import('@/views/auth/LoginView.vue'),
    },
    {
      path: '/auth/register',
      component: () => import('@/views/auth/RegisterView.vue'),
    },
    {
      path: '/customer',
      component: () => import('@/components/layout/PageWrapper.vue'),
      children: [
        { path: 'home', component: () => import('@/views/customer/HomeView.vue') },
        { path: 'services', component: () => import('@/views/customer/ServicesView.vue') },
        { path: 'activity', component: () => import('@/views/customer/ActivityView.vue') },
        { path: 'alerts', component: () => import('@/views/customer/AlertsView.vue') },
        { path: 'account', component: () => import('@/views/customer/AccountView.vue') },
      ],
    },
    {
      path: '/worker',
      component: () => import('@/components/layout/PageWrapper.vue'),
      children: [
        { path: 'home', component: () => import('@/views/worker/WorkerHomeView.vue') },
        { path: 'jobs', component: () => import('@/views/worker/WorkerJobsView.vue') },
        { path: 'activity', component: () => import('@/views/worker/WorkerActivityView.vue') },
        { path: 'alerts', component: () => import('@/views/worker/WorkerAlertsView.vue') },
        { path: 'account', component: () => import('@/views/worker/WorkerAccountView.vue') },
      ],
    },
    {
      path: '/worker-profile/:id',
      component: () => import('@/views/shared/WorkerDetailView.vue'),
    },
  ],
})

export default router