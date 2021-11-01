import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from 'components/login'
import Home from 'components/Home'
import Welcome from 'components/Welcome'
import Users from 'components/users/Users'
import Rights from 'components/power/Rights'
import roles from 'components/power/Roles'
import Cate from 'components/goods/Cate'
import Params from 'components/goods/Params'
import List from 'components/goods/List'
import Add from 'components/goods/Add'
import Orders from 'components/orders/Orders'
import Reports from 'components/reports/Reports'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: List
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/orders',
        component: Orders
      },
      {
        path: '/reports',
        component: Reports
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: "history"
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem("token")
  if (tokenStr) return next()
  next("/login")
})
export default router
