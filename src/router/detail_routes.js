import article_list from '@/views/article_list.vue'
import article_detail from '@/views/article_detail.vue'
import calender from '@/views/calender.vue'

const detail_routes = [{
  path: '/',
  name: 'list-index',
  redirect: '/list/DEVELOP'
}, {
  path: '/list/:category',
  name: 'list',
  component: article_list,
  meta: {
    keep_alive: true
  }
}, {
  path: '/calender',
  name: 'calender',
  component: calender
}, {
  path: '/articles/detail',
  name: 'article_detail',
  component: article_detail
}]

export default detail_routes
