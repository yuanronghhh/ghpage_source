<template>
  <div id="config">
    <div v-for="value, key in config">
      {{ key }} : {{ value }}
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      config: {
        mode: 'dark'
      }
    }
  },
  components: {
  },
  methods: {
  },
  created () {
  }
}
</script>
<style lang="scss">
#config {
  padding: 20px 2%;
  background:red;
  margin: 10px 1%;
}
</style>
