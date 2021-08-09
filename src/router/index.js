import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/layout'
import Home from '../views/Home'
import edit from '../views/layout/edit.vue'
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
  },
  {
    path: '/edit',
    name: 'edit',
    component: edit
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
