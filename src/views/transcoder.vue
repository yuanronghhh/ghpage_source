<template>
  <div class="editor" id="transcoder">
    <div class="options"></div>

    <div id="edit-place">
      <div id="edit">
        <textarea @input="onEdit" v-model="editor.text"></textarea>
      </div>
      <pre id="preview-place">{{ editor.prev_text }}</pre>
    </div>
  </div>
</template>

<script>
import Logger from '../libs/logger'

export default {
  data () {
    return {
      editor: {
        text: 'hello',
        prev_text: ''
      }
    }
  },
  methods: {
    updateData (data) {
      this.editor.text = data
      this.editor.prev_text = data
    },
    onEdit (evt) {
      let data = evt.target.value
      this.updateData(data)
    },
    swithPrev () {
      let val = this.editor.show_prev
      this.editor.show_prev = val ? false : true
      this.editor.bt_prev_text = val ? '显示结果' : '编辑'
    }
  },
  created() {
    Logger.debug('[transcoder]')
  }
}
</script>
<style lang="scss">
.editor {
  #edit-place {
    position: absolute;
    bottom:0px;
    top: 90px;
    right: 20%;
    left: 20%;
    border-radius: 10px;

    #edit {
      height: 50%;
      border: solid 1px black;
    }

    textarea {
      width: 96%;
      height: 100%;
      font-size: 1em;
      line-height: 1.5em;
      border-radius: 10px;
    }

    #preview-place {
      top: 1000px;
      height: 50%;
      overflow: auto;
      margin: 0px;
      border-radius: 10px;
    }
  }
}

@media screen and (max-width:800px ) {
  div#transcoder div#edit-place {
    left: 1%;
    right: 1%;
  }

  button#md-prev-button {
    right: 0;
  }
}
</style>
