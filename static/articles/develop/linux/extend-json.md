{
  "title": "extend-json开发库",
  "profile": "一个扩展JSON的库",
  "create_at": "2021-02-08T00:00:00",
  "update_at": "2021-02-08T00:00:00"
}
# extend-json库

## 介绍
一个基于`Glib`实现表达的树结构开发库。

许多时候，表达树形结构的时候，JSON使用`Children`作为一个属性来表示父子关系。
但很多时候嵌套会比较深，很容易分不清数据和`Children`位置，所以， 
这里使用`<>`放到键的后面作为数据的存储，以减少层级关系, 并扩展了`JSON`的一些功能

## 协议
基于`Glib`开发，所以协议是`LGPL`

## 实现
如果作为配置文件使用，方法`ej_parse`和`ej_print_value`即可满足要求。
对于其他需求，因为对象，数组的实现，均使用`glib`中的指针数组，所以，
直接使用`Glib`中数组方法进行操作即可。

## 扩展的功能
1. 支持尖括号中使用`json`格式嵌套, 即`{Key<key2<k3:v3>:value2>: value}`格式
2. 支持使用`@`前缀表达特殊的`EOBJECT`类型，`json`里面，键和值均可以这样做。
这里可以实现键值的绑定，比如，`{@{event:"clicked"}: "onclick"}`,即可表示点击事件时,
触发`onclick`函数。

例子如下：
```json
{
  Window<class:"top", id:"topWindow">: {
    Panel<class:"panel",height:80,width:100>: {
      Button<class:"btn1", @{event:"clicked"}:"on_click">: null
    }
  }
}
```

## 使用方法

具体可以参考`ExtendJsonTest.c`中使用的方法。

```c
#include <stdbool.h>
#include "glib.h"
#include "ExtendJson.h"

static void test_mutiple_bytes_string(void) {
  gchar *str = "[\"汉字\", {age: 2}]";
  EJError *error = NULL;
  gchar *out = NULL;
  EJValue *value = ej_parse(&error, str);
  // TEST_ASSERT_NULL(error);
  // TEST_ASSERT_NOT_NULL(value);

  // TEST_ASSERT_TRUE(ej_print_value(value, &out));
  // TEST_ASSERT_EQUAL_STRING(out, "[\"汉字\",{\"age\":2}]");

  g_free(out);
  ej_free_value(value);
}

int main() {
  return test_mutiple_bytes_string();
}
```
## 源码地址
[源码地址](https://github.com/yuanronghhh/extend-json)
