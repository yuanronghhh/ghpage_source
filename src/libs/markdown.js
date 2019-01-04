require('./highlight')
require('./remarkable')
require('./autosize')
const hljs = window.hljs;
const Remarkable = window.Remarkable;

class MarkDown {
  constructor () {
    this.engine = new Remarkable({
      html: true,
      xhtmlOut: true,
      breaks: true,
      langPrefix: 'language-',
      linkify: true,
      typographer: true,
      quotes: '“”‘’',
      highlight: function(str, lang){
        try {
          if(lang && hljs.getLanguage(lang)){
            return hljs.highlight(lang, str).value
          }
        } catch (err) {
          console.log(err)
        }
      }
    })
  }

  render (data) {
    let group = data.match(/^{[^}]*?}/)

    if(group != null && group.length > 0) {
      data = data.substr(group[0].length)
    }

    return this.engine.render(data)
  }

  editor (input, preview) {
    this.update = function () {
      this.renderToHtml(input.value, preview)
    }

    input.markDownEditor = this
    this.update()
  }
}

export default new MarkDown()
