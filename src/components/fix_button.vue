<template>
  <div class="fix-button" @click="toggleToc">
    <div class="index" v-html="html" v-show="show_content"></div>
    <div class="fix-bar" v-show="!show_content">{{ label }}</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      show_content: false
    }
  },
  props: {
    html: String,
    label: String
  },
  methods: {
    toggleToc () {
      if(!this.show_content && this.html.length > 0) {
        this.show_content = true
      } else {
        this.show_content = false
      }
    }
  }
}
</script>
<style lang="scss">
.fix-button {
  position: fixed;
  right: 23%;
  background: #ffffffeb;
  padding: 10px;
  z-index: 10;
  border: solid 1px black;
  border-radius: 10px;
  cursor: pointer;
}

@media screen and (max-width:800px ) {
  .fix-button {
    right: 3%;
  }
}
</style>
