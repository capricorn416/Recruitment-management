import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Group from '../views/Group.vue'
import Login from '../views/Login.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/group',
    component: Group
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const user = window.localStorage.getItem('user');

  if(to.path !== '/login'){
    if(user) {
      next()
    }else {
      next('/login')
    }  
  }else {
    next()
  }
})

export default router
