{
  "title": "python 耗时修饰器",
  "profile": "简单测试某个函数调用时间损耗",
  "create_at": "2020-07-10T12:10:01",
  "update_at": "2020-07-10T12:10:01"
}

# python 耗时修饰器

## 说明
简单测试某个函数调用时间损耗

## 脚本
```python
import time


def time_cost():
    def decorator(func):
        def wrapper(*args, **kwargs):

            start = time.time()

            func(*args)

            end = time.time()
            print("%s start at: %s" % (func.__name__, start))
            print("%s end at: %s:" % (func.__name__, end))
            print("%s cost: %s\n" % (func.__name__, (end - start)))

        return wrapper

    return decorator
```
