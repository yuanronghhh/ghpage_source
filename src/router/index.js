import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index'
import editor from '@/views/editor'
import detail_routes from './detail_routes'
import not_found from '@/views/not_found'
import Theme from '../libs/theme'
import Logger from '../libs/logger'
import config from '../config/config'

Vue.use(Router)

const routes = [{
  path: '/',
  component: index,
  children: detail_routes
}, {
  path: '/config/:name/:value',
  name: 'config',
  template: ''
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
}]

const router = new Router({
  mode: 'hash',
  routes: routes
})

router.beforeUnload = (evt) => {
}
window.onbeforeunload = router.beforeUnload

router.beforeEach((to, from, next) => {
  Logger.debug('[router]', from.path, "==>", to.path)
  if (config.hasOwnProperty('theme')) {
    Theme.switchTheme(config.theme)
  } else {
    Theme.theme = 'light'
  }

  return next()
})

export default router
