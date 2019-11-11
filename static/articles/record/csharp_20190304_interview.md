{
  "title": "csharp_面试的题目",
  "profile": "20190304面试的几个题目",
  "create_at": "2019-03-04T00:00:00",
  "update_at": "2019-03-04T00:00:00"
}
# C#面试的几个题目
## 1. 输出三角，要求可以输入n行
手写的时候弄不对，这里写一下。
```c
#include <stdio.h>

int main(int argc, char * argv []) {
  int i = 1, j = i;
  int line;
  int n;

  printf("[Get Data]: ");
  scanf("%d", &line);

  n = 2 * line + 1;

  for (i = 1; i < n; i+=2) {
    for(j = 0; j < (n - i) / 2; j++) {
      printf("%s", " ");
    }

    for(j = 0; j < i; j++) {
      printf("%s", "*");
    }

    for(j = 0; j < (n - i) / 2; j++) {
      printf("%s", " ");
    }

    printf("\n");
  }

  return 0;
}
```
**结果**
![csharp_20190304_1.JPG](/static/images/csharp_20190304_1.JPG)

## 2. 分别解释WebService，WCF，WebAPI？
WebService 是可以将应用程序转换为网络应用的程序，协议基于HTTP，数据传输格式为XML。最常见的WebService协议为SOAP。

WCF是由微软开发的支持数据通信的应用程序框架，协议有以下几种：
- HTTP/HTTPS
- TCP，通过NetTcpBinding基于TCP传输，协议路径以net.tcp://开头，端口号808。
- Pipe
对于同一台机器不同进程间的通讯，`WCF`使用`Named Pipes`进行通讯，主机名|域名|IP部分只能是本机的机器名，URI格式具有net.pipe前缀，端口不作用途。
- Msmq
`net.msmq://example.com/`

WebAPI 是基于web服务或浏览器的交互接口，是一种开发理念，通常情况下，它不需要考虑服务端情况，并配合JSON或XML数据格式进行实现。例如，基于http协议的`REST`交互遵循以下几个原则：
- 一个资源在互联网上仅有唯一对于路径(URI)。
- 使用HTTP定义的`DELETE`,`POST`,`GET`,`METHOD`, `PUT`方法进行操作资源。
- 同一个资源可以有多重表述方式。例如图片也可以用文本显示出来，数据格式可以用XML，HTML多种格式展示出来。
- 通信状态是无状态的。
