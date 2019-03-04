{
  "title": "csharp_面试的一道题题目",
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
### 结果
![csharp_20190304_1.JPG](/static/images/csharp_20190304_1.JPG)
