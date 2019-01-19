<template>
  <div id="fix-button" @click="toggleToc">
    <div class="index" v-html="html" v-show="show_toc"></div>
    <div class="fix-bar" v-show="!show_toc">目录</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      show_toc: false
    }
  },
  props: {
    html: String
  },
  methods: {
    toggleToc () {
      if(this.show_toc) {
        this.show_toc = false
      } else {
        this.show_toc = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
div#fix-button {
  position: fixed;
  right: 23%;
  bottom: 40px;
  background: #ffffffeb;
  padding: 10px;
  z-index: 10;
  border: solid 1px black;
  border-radius: 10px;
  .index {
    overflow: auto;
    height: 400px;
  }
}

@media screen and (max-width:800px ) {
  div#fix-button {
    right: 3%;
  }
}
</style>
