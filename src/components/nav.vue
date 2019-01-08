<template>
  <div id="nav">
      <h1 class="title">
        <span class="t-en">GreyHound</span>
      </h1>

      <div class="nav-tab">
        <template v-for="nv in nav_list">
          <router-link :to="nv.path"><span class="nv">{{ nv.name }}</span></router-link>
        </template>
        <span class="nv" @click="switchCss">{{ mode }}</span>
      </div>
  </div>
</template>

<script>
import Theme from '../libs/theme'

let nav_list = [{
  path: "/list/record",
  name: "RECORD"
}, {
  path: "/list/develop",
  name: "DEVELOP"
}, {
  path: "/articles/detail?article_path=/static/articles/about/aboutme.md",
  name: "ABOUT"
}]

export default {
  data () {
    return {
      mode: "MODE",
      nav_list: nav_list
    }
  },
  methods: {
    switchCss () {
      Theme.auto_switch = 'off'
      let themes = Theme.themes
      let idx = themes.indexOf(Theme.theme)
      let next = idx + 1 >= themes.length ? 0 : idx + 1

      Theme.switchTheme(themes[next])
    }
  }
}
</script>
<style lang="scss">
@import '../assets/css/main.scss';

#nav {
  box-shadow: 0 0 10px 0 rgba(96, 96, 96, 0.4);
  background: white;
  border-radius: 0 0px 10px 10px;
  color: $MAIN_COLOR;
  height: 80px;
  .t-en {
    color: #4a1e1e;
  }
}

.nav-tab {
  margin: 0px 2%;
  text-align: center;
  .nv {
    color: #93bf97;
    font-size: 0.8em;
    padding: 0.5em 2%;
  }
  .nv:hover {
    cursor: pointer;
  }
}
</style>
