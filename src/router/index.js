import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/layout'
import Home from '../views/Home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'layout',
    component: Layout
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const user = window.localStorage.getItem('user');

  if(to.path !== '/home'){
    if(user) {
      next()
    }else {
      next('/home')
    }  
  }else {
    next()
  }
})

export default router
