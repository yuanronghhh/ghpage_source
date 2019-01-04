import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index'
import editor from '@/views/editor'
import detail_routes from './detail_routes'
import not_found from '@/views/not_found'
import Storage from '../libs/storage'
import Theme from '../libs/theme'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [{
    path: '/',
    component: index,
    children: detail_routes
  }, {
    path: '/editor',
    name: 'editor',
    component: editor
  }, {
    path: '/NOTFIND',
    name: 'notfind',
    component: not_found
  }, {
    path: '*',
    redirect: '/'
  }],
  scrollBehavior (to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 }
  }
})

router.beforeUnload = (evt) => {
  // Storage.setItem('config', config)
}

window.onbeforeunload = router.beforeUnload

router.beforeEach((to, from, next) => {
  let config = Storage.getItem('config')
  if (config !== null && config.hasOwnProperty('theme')) {
    Theme.switchTheme(config.theme)
    Theme.auto_switch = 'off'
  } else {
    Theme.theme = 'default'
  }
  return next()
})

export default router
