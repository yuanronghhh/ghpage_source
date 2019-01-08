import env from '../config/env'

class PathUtils {
  static toPagePath (path) {
    if (!path) {
      return
    }

    if (!env.on_github) {
      return path
    }

    if (path.startsWith('/')) {
      return '/ghpage' + path
    } else {
      return '/ghpage/' + path
    }
  }
}

export default PathUtils
