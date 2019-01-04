<template>
  <div id="index">
    <nv-nav></nv-nav>

    <keep-alive>
      <router-view v-if="$route.meta.keep_alive"></router-view>
    </keep-alive>

    <router-view v-if="!$route.meta.keep_alive"></router-view>

    <div class="footer">
      <span id="time-now">{{ now }}</span>
    </div>

  </div>
</template>

<script>
import nvNav from '../components/nav.vue'
import Tools from '../libs/tools'
import TimeConverter from '../libs/timeConverter'
import Theme from '../libs/theme'
import Calendar from '../libs/calendar'

export default {
  data () {
    return {
      now: Tools.getTime(new Date())
    }
  },
  components: {
    nvNav
  },
  methods: {
    setClock () {

      const self = this
      setInterval(() => {
        const tm = new Date()
        let tc = new TimeConverter(tm)
        let fest = Calendar.getFestval(tc.tm)

        if (typeof(fest) !== 'undefined') {
          self.now = fest
        } else {
          self.now = tc.formatDateWithSecond()
        }

        if (Theme.auto_switch === 'on') {
          if (tc.tm.hours > 5 && tc.tm.hours < 18) {
            Theme.switchTheme('light')
          } else {
            Theme.switchTheme('dark')
          }
        }
      }, 1000)
    }
  },
  created() {
    this.setClock()
  }
}
</script>
