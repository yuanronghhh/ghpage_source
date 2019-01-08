<template>
  <div v-html="article.content" class="detail"></div>
</template>

<script>
import Tools from '../libs/tools'
import md from '../libs/markdown'
import Logger from '../libs/logger'
require('../assets/css/effect.scss')
require('../assets/css/highlight.scss')

export default {
  data () {
    return {
      article: {}
    }
  },
  methods: {
    getArticle (path) {
      const self = this

      Tools.getFile(path, (err, data) => {
        if (err) {
          Logger.debug(err);
          return
        }

        self.article = {
          content: md.render(data)
        }
      })
    }
  },
  created () {
    const path = this.$route.query.article_path
    this.getArticle(path)
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
  background: #ffffff;
  transition: 0.5s;
  padding: 1em;
  overflow: hidden;
  border-radius: 10px;
  margin: 10px 1% 50px 1%;
}
</style>
