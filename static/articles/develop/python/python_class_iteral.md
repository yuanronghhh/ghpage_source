{
  "title": "遍历Python类属性",
  "profile": "遍历Python类属性",
  "create_at": "2018-11-02T00:00:00",
  "update_at": "2018-11-02T00:00:00"
}

# 遍历Python类属性
```python
def iteral_class(clss):
    class IterMeta(type):
        def __iter__(self):
            for attr in dir(clss):
                if not attr.startswith("__"):
                    yield "%s_%s" % (clss.__name__, attr), getattr(clss, attr)

    class IterClassWrapper(metaclass=IterMeta):

        def __init__(self, *args, **kargs):
            self.wrapped = clss(*args, **kargs)

        def __getattr__(self, attr):
            return getattr(self.wrapped, attr)

    return IterClassWrapper
```
在类上面添加修饰器，然后按照for循环便利即可。
