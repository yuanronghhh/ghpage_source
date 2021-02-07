<template>
  <div class="input-line search">
    <input id="search_key" class="keyword"
                           type="text" 
                           placeholder="关键字以空格分开"
                           @keypress.tab="clickTab"
                           @input="searchResult" ></input>
    <button id="search" class="submit">搜索</button>
  </div>
</template>

<script>
import store from '../vuex/store'
import Tools from '../libs/tools'
import Logger from '../libs/logger'

export default {
  props: {
    showResult: Function
  },
  methods: {
    searchResult (evt) {
      const key = evt.target.value
      const article_list = store.state.article_list
      let node = this.$route.params.category

      if (!node) {
        Logger.debug("[NOT FIND node]")
        return
      }

      node = node.toUpperCase()

      let arr = article_list[node].filter((ele, idx) => {
        delete ele["create_at"]
        return ele
      })

      if(key.match(" ")) {
        let keys = key.split(" ")
        for(let i = 0; i < keys.length; i++) {
          let k = keys[i]

          arr = Tools.searchInArray(k, arr)
        }
        this.showResult(arr)
      } else {
        this.showResult(Tools.searchInArray(key, arr))
      }
    },
    clickTab (evt) {
      Logger.debug('log', evt)
    }
  },
  created () {
  }
}
</script>
<style lang="scss">
.search {
  input {
    width: calc(100% - 90px);
  }

  button {
    width: 80px;
    background: #f9f99f;
  }

  box-shadow:0 0 10px 0 rgba(96, 96, 96, 0.4);
}

.input-line {
  margin: 10px;
  width: calc(100% - 20px);
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
}

</style>
