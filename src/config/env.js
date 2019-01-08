import browser from '../libs/browser'

let on_github = window.location.hostname.indexOf("github.io") > -1 ? true: false
let env = {
  is_remote: false,
  on_github: on_github,
  browser: browser
}

export default env
