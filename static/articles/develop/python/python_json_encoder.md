{
  "title": "Python调整JSON解析",
  "profile": "覆盖boolean值和datetime格式",
  "create_at": "2018-11-02T00:00:00",
  "update_at": "2018-11-02T00:00:00"
}

# 调整Python的JSON解析方式

## 说明
主要是调整布尔值的输出，还有日期格式的输出。

```python
# -*- coding: utf-8 -*-
from datetime import datetime
import json
import decimal


class JsonEncoder(json.JSONEncoder):
    def default(self, o): # pylint: disable=E0202

        if isinstance(o, set):
            return list(o)

        if isinstance(o, datetime):
            return o.isoformat()

        if isinstance(o, bytes):
            if o == b'\x00':
                return False
            elif o == b'\x01':
                return True

        if isinstance(o, decimal.Decimal):
            return float(o)      #  这里会影响到model取出数据

        return json.JSONEncoder.default(self, o)

class Serializer:

    @staticmethod
    def serialize(obj):
        if obj is None:
            return

        return json.dumps(obj, cls=JsonEncoder, ensure_ascii=False)

    @staticmethod
    def deserialize(jstr):
        if not jstr:
            return

        return json.loads(jstr)

    @staticmethod
    def deserialize_result(ls, keys):
        if not ls:
            return []

        if isinstance(ls, list):
            for l in ls:
                for k in keys:
                    if k in l:
                        l[k] = Serializer.deserialize(l[k])

            return ls

        elif isinstance(ls, dict):
            for k in keys:
                if k in ls:
                    ls[k] = Serializer.deserialize(ls[k])

            return ls
```

### json注释问题

顺便提一下，如果json可能需要注释，处理数据前，可以使用正则处理一下
注释使用`#`开头。数据里面不能含有这个符号.
```bash
import re
res = re.sub("#[^\n]*", "", data)
```
