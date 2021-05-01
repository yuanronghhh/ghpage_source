require('./highlight')
require('./remarkable')
require('./autosize')
require('highlightjs-line-numbers.js')
const Hljs = window.hljs
const Remarkable = window.Remarkable
const Toc = require('markdown-toc')

class MarkDown {
  constructor () {
    let option = {
      html: true,
      xhtmlOut: true,
      breaks: true,
      langPrefix: 'language-',
      linkify: true,
      typographer: true,
      quotes: '“”‘’',
      highlight: function(str, lang){
        try {
          if(lang && Hljs.getLanguage(lang)){
            return Hljs.highlight(lang, str).value
          }
        } catch (err) {
          console.log(err)
        }
      }
    }

    this.engine = new Remarkable(option).use((remarkable) => {
      remarkable.renderer.rules.heading_open = (tokens, idx) => {
        return '<h' + tokens[idx].hLevel + ' id=' + Toc.slugify(tokens[idx + 1].content) + '>'
      }

      remarkable.renderer.rules.heading_open = (tokens, idx) => {
        return '<h' + tokens[idx].hLevel + ' id=' + Toc.slugify(tokens[idx + 1].content) + '>'
      }

      remarkable.renderer.rules.link_open = function (tokens, idx, options /* env */) {
        var title = tokens[idx].title ? (' title="' + Toc.slugify(tokens[idx].title) + '"') : ''
        var target = options.linkTarget ? (' target="' + options.linkTarget + '"') : ''

        /* hash url */
        if (tokens[idx].href.startsWith('#/')) {
          return '<a href="' + tokens[idx].href + '"' + title + target + '>'
        }

        /* anchor */
        let anchor = tokens[idx].href.match(/#\s{0,1}[^\s\\/]*/)
        if(anchor !== null) {
          var hash = window.location.hash
          var qp = hash.indexOf("?")
          var query = hash.substr(qp).substring(1).replace(/anchor=[^&]*/, '')
          var path = qp > -1 ? hash.substr(0, qp) : hash
          query = query ? query + '&': ''
          return '<a href="' + path + '?' + query + 'anchor=' + Toc.slugify(tokens[idx].href.replace('#', '')) + '"' + title + target + '>'
        }

        return '<a href="' + tokens[idx].href + '"' + title + target + '>'
      }
    })
  }

  deleteInfo(raw) {
    let group = raw.match(/^{[^}]*?}/)

    if(group != null && group.length > 0) {
      raw = raw.substr(group[0].length)
    }

    return raw
  }

  parseInfo(raw) {
    let group = raw.match(/^{[^}]*?}/)

    if(group != null && group.length > 0) {
      return JSON.parse(group[0])
    }

    return null
  }

  renderToc(data) {
    let tdata = Toc(data).content
    return tdata
  }

  render (raw) {
    let data = this.deleteInfo(raw)
    data = this.engine.render(data)
    return data
  }

  renderNumber() {
    const pre = document.getElementsByTagName("pre")
    for(let i = 0; i < pre.length; i++) {
      let block = pre[i].children[0]
      Hljs.lineNumbersBlock(block)
    }
  }
}

export default new MarkDown()
