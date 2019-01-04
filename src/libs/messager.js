import { Message } from 'element-ui';

class Messager {
  static errorMsg (result) {
    Message.error(result.msg)
  }

  static successMsg (result) {
    Message.success(result.msg)
  }
}

export default Messager
