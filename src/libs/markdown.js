require('./highlight')
require('./remarkable')
require('./autosize')
const hljs = window.hljs
const Remarkable = window.Remarkable
const toc = require('markdown-toc')

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
          if(lang && hljs.getLanguage(lang)){
            return hljs.highlight(lang, str).value
          }
        } catch (err) {
          console.log(err)
        }
      }
    }

    this.engine = new Remarkable(option).use((remarkable) => {
      remarkable.renderer.rules.heading_open = (tokens, idx) => {
        return '<h' + tokens[idx].hLevel + ' id=' + toc.slugify(tokens[idx + 1].content) + '>';
      };

      remarkable.renderer.rules.heading_open = (tokens, idx) => {
        return '<h' + tokens[idx].hLevel + ' id=' + toc.slugify(tokens[idx + 1].content) + '>';
      };

      remarkable.renderer.rules.link_open = function (tokens, idx, options /* env */) {
        var title = tokens[idx].title ? (' title="' + toc.slugify(tokens[idx].title) + '"') : '';
        var target = options.linkTarget ? (' target="' + options.linkTarget + '"') : ''

        /* hash url */
        if (tokens[idx].href.startsWith('#/')) {
          return '<a href="' + tokens[idx].href + '"' + title + target + '>'
        }

        /* anchor */
        let anchor = tokens[idx].href.match(/#\s{0,1}[^\s\\/]*/);
        if(anchor !== null) {
          var hash = window.location.hash;
          var query = hash.substr(hash.indexOf("?")).substring(1).replace(/&anchor=[^&]*/, '');
          return '<a href="#/articles/detail?' + query + '&anchor=' + toc.slugify(tokens[idx].href.replace('#', '')) + '"' + title + target + '>'
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
    let tdata = toc(data).content
    return tdata
  }

  render (raw) {
    let data = this.deleteInfo(raw)
    data = this.engine.render(data)
    return data
  }
}

export default new MarkDown()
