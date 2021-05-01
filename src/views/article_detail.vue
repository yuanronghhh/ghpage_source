<template>
  <div class="detail">
    <div class="detail-footer">最后更新于: {{ article.update_at | formatTime }}</div>
    <div v-html="article.content"></div>
    <div class="fix-button back" @click="back">返回</div>
    <fix-button class="toc" :html="article.toc" label="目录"></fix-button>
  </div>
</template>

<script>
import Tools from '../libs/tools'
import md from '../libs/markdown'
import TimeConverter from '../libs/timeConverter'
import Logger from '../libs/logger'
import fixButton from '../components/fix_button'
require('../assets/css/effect.scss')
require('../assets/css/highlight.scss')

export default {
  components: {
    fixButton
  },
  data () {
    return {
      article: {}
    }
  },
  filters: {
    formatTime (tm) {
      if (!tm) {
        return '';
      }

      let tc = new TimeConverter(tm)
      return tc.formatDateWithSecond()
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    toggleToc () {
      this.$children[0].toggleToc()
    },
    scrollAnchor () {
      const anchor = this.$route.query.anchor
      let anc = document.getElementById(anchor)

      Logger.debug("[anchor]", anchor)
      if (anchor === null || anc === null) {
        return
      }

      anc.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })
    },
    getArticle (path) {
      const self = this

      Tools.getFile(path, (err, data) => {
        if (err) {
          Logger.debug(err)
          return
        }

        let info = md.parseInfo(data)

        self.article = {
          content: md.render(data),
          toc: md.render(md.renderToc(data)),
          update_at: info ? info.update_at : ""
        }

      })
    }
  },
  created () {
    const path = this.$route.query.article_path
    if(path) {
      this.getArticle(path)
    }
  },
  updated() {
    this.scrollAnchor()
    md.renderNumber()
  },
  watch: {
    "$route" (to, from) {
      const path = this.$route.query.article_path
      this.getArticle(path)
    }
  }
}
</script>
<style lang="scss">
.detail {
  background: #ffffffe0;
  transition: 0.5s;
  padding: 1em;
  overflow: hidden;
  border-radius: 10px;
  margin: 10px 1% 100px 1%;
  box-shadow:0 0 10px 0 rgba(96, 96, 96, 0.4);
}
.detail-footer {
  text-align: right;
  padding: 10px;
}

.toc {
  bottom: 50px;
  .index {
    max-height: 450px;
    overflow: auto;
  }
}

.back {
  bottom: 100px;
}
</style>
