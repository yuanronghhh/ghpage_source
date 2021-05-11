<template>
  <div class="editor">
    <nv-nav></nv-nav>

    <div id="edit-place">
      <div id="edit" v-show="!editor.show_prev">
        <textarea @input="onEdit" @drop="dragDrop" v-model="editor.text"></textarea>
      </div>
      <div id="preview-place" v-html='editor.prev_text' v-show="editor.show_prev"></div>
      <div class="fix-button back" @click="backTop" v-show="editor.show_prev">顶部</div>
      <fix-button class="toc" :html="editor.toc" label="目录" v-show="editor.show_prev"></fix-button>
    </div>

    <button id="md-prev-button" class="button" @click="swithPrev">{{ editor.bt_prev_text }}</button>
  </div>
</template>

<script>
import Storage from '../libs/storage'
import md from '../libs/markdown'
import nvNav from '../components/nav.vue'
import Logger from '../libs/logger'
import fixButton from '../components/fix_button'

export default {
  components: {
    nvNav,
    fixButton
  },
  data () {
    return {
      editor: {
        text: '# 提示  \n' +
'## 注意事项  \n' +
'1. markdown每3秒自动保存，大小不能超过4M  \n' +
'2. 因为`linux`下创建时间无法获取，所以可以在文件前面写json信息, 保留文件创建时间和标题等信息  \n\n' +
'例如: \n' +
'```javascript\n' +
'{\n' +
'    "title": "title",\n' +
'    "create_at": "2018-10-12"\n' +
'}\n' +
'\n' +
'这里写正文内容\n' +
'```\n' +
'3. 支持在编辑模式下将文件拖入浏览器编辑。\n',
        prev_text: '',
        show_prev: false,
        bt_prev_text: '显示预览',
        toc: ''
      }
    }
  },
  methods: {
    readFile (fname, data) {
      this.editor.text = data
      this.updateData(data)

      Logger.debug('[read file]', fname)
    },
    backTop() {
      var anc = document.getElementById("nav")
      anc.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })
    },
    dragDrop (evt) {
      evt.stopPropagation();
      evt.preventDefault()
      let fls = evt.dataTransfer.files

      if (fls !== null && fls.length < 1) {
        return
      }

      let f = fls[0];
      let fr = new window.FileReader()
      fr.onload = ((f) => {
        return (evt) => {
          let data = evt.target.result
          this.readFile(f.name, data)
        }
      })(f)
      fr.readAsText(f)
      Logger.debug('drop evt', fls)
    },
    swithPrev () {
      let val = this.editor.show_prev
      this.editor.show_prev = val ? false : true
      this.editor.bt_prev_text = val ? '显示预览' : '编辑'
    },
    timerSave () {
    },
    onEdit (evt) {
      let data = evt.target.value
      Storage.setItem('edit_article', this.editor.text)
      this.updateData(data)
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
    updateData (data) {
      this.editor.text = data
      this.editor.toc = md.render(md.renderToc(data))
      this.editor.prev_text = md.render(data)
    },
    recoverStorage () {
      let data = Storage.getItem('edit_article')

      if (!data) {
        data = this.editor.text
      }
      this.updateData(data)
      this.timerSave()
    }
  },
  updated() {
    md.renderNumber()
  },
  watch: {
    "$route" (to, from) {
      this.scrollAnchor()
    }
  },
  created () {
    this.recoverStorage()
  }
}
</script>
<style lang="scss">
#md-prev-button {
  position: absolute;
  right: 20%;
  font-size: 0.8em;
  border-radius: 0 10px 0 10px;
}

#nav {
  height: 80px;
  margin-bottom: 10px;
}

#app {
  width: 100%;
  height: 100%;
}

.editor {
  #edit-place {
    position: absolute;
    bottom:20px;
    top: 90px;
    right: 20%;
    left: 20%;
    border-radius: 10px;
    padding-top: 2%;

    #edit {
      height: calc(100% - 20px);
    }

    textarea {
      width: 96%;
      height: 100%;
      padding: 0px 2%;
      font-size: 1em;
      line-height: 1.5em;
      border-radius: 10px;
    }

    #preview-place {
      width: 96%;
      height: 100%;
      overflow: auto;
      padding: 0px 2% 0px 2%;
      border-radius: 10px;
    }
  }

}
.toc {
  bottom: 50px;
  .menu {
    max-height: 450px;
    overflow: auto;
  }
}

.back {
  bottom: 100px;
}

@media screen and (max-width:800px ) {
  div.editor div#edit-place {
    left: 1%;
    right: 1%;
  }

  button#md-prev-button {
    right: 0;
  }
}

</style>
