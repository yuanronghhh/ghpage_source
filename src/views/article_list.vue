<template>
  <div id="list">
    <nv-search :showResult="showResult"></nv-search>
    <div id="article-list">

        <div class="at-list" v-for="article in article_list">
          <div class="at-left">
            <div class="pre-text"> {{ article.title | subFirstStr }} </div>
          </div>

          <router-link :to="article.path | concatPath ">
            <div class="at-right">
              <span class="profile-title">{{ article.title }}</span>
              <div class="profile-time">{{ article.update_at | formatTime }}</div>
              <div class="profile-content">{{ article.profile }}</div>
            </div>
          </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Tools from '../libs/tools'
import TimeConverter from '../libs/timeConverter'
import store from '../vuex/store'
import nvSearch from '../components/search'

export default {
  components: {
    nvSearch
  },
  data () {
    return {
      article_list: []
    }
  },
  filters: {
    subFirstStr (str) {
      return str.substring(0, 1)
    },
    concatPath (str) {
      return '/articles/detail?article_path=/' + encodeURIComponent(str)
    },
    formatTime (tm) {
      let tc = new TimeConverter(tm)
      return tc.formatDateWithSecond()
    }
  },
  methods: {
    showResult (ls) {
      this.article_list = ls
    },
    changeArticleList (data) {
      this.article_list = data
    },
    getArticleList () {
      const path = "static/articles/list.json"
      let key = this.$route.params.category

      if(key) {
        key = key.toUpperCase()
      }

      const self = this
      Tools.getFile(path, (err, data) => {
        if (err) {
          return
        }

        let ls = JSON.parse(data)

        self.article_list = ls[key]
        store.commit('setArticleList', ls)
      })
    }
  },
  watch: {
    "$route" (to, from) {
      if (to.name === 'list') {
        if (to.params.category !== from.params.category) {
          this.getArticleList()
        }
      }
    }
  },
  created () {
    this.getArticleList()
  }
}
</script>
<style lang="scss">
@import '../assets/css/main.scss';

$PROFILE_IMG: 60px;
#article-list {
  margin: 0px 1% 50px 1%;
  background: #ffffffe0;
  box-shadow: 0 0 10px 0 rgba(96, 96, 96, 0.4);
  border-radius: 10px;

  .at-list {
    display: inline-block;
    margin: 0.2em 0%;
    padding: 0.2em 0%; 
    width: 100%;

    .at-left {
      margin: 10px;
      width: $PROFILE_IMG;
      height: $PROFILE_IMG;
      border-radius: $PROFILE_IMG / 2;
      background: #707070;
      float: left;

      .pre-text {
        text-align: center;
        padding: 14px;
        color: white;
        font-size: 25px;
      }
    }

    .at-right {
      margin: 10px 0px 0px 85px;
      padding-right: 1em;

      .profile-title {
        font-size: 1.1em;
      }

      .profile-time {
        font-size: 0.8em;
        color: $MAIN_COLOR;
      }

      .profile-content {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        text-overflow: ellipsis;
        overflow: hidden;
        margin-right: 10%;
        height: 2.5em;
      }
    }
  }
}
</style>
