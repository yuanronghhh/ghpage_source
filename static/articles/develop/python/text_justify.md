{
  "title": "文本两端对齐",
  "profile": "leetcode一个算法题目",
  "create_at": "2017-03-10T12:10:01",
  "update_at": "2017-03-10T12:10:01"
}
# leetcode题目: 文本两端对齐

leetcode上的一道题

题目地址: [Text-Justification](https://leetcode.com/problems/text-justification/#)
```python
#!/bin/env python
# -*- coding: utf8 -*-

"""
words = ["This", "is", "an", "example", "of", "text", "justification."]
L = 16

返回值:
[
   "This    is    an",
   "example  of text",
   "justification.  "
]
思路：
1. 将字符往array里存，字符总长度 + 字符数 > maxWidth, 弹出一个。
2. 计算(maxWidth - 字符总长度) = 剩余空格，平均空格 = 剩余空格 / 字符数。
3. 取出(倒过来)[len-1, 1]个字符并append平均空格，次数为 字符数-1次。

最后一行：
直接添加空格即可。
"""
words = ["This", "is", "an","example", "of", "text", "justification."]
maxWidth = 16
builder = []


class Solution(object):
    def fullJustify(self, words, maxWidth):
        """
        :type words: List[str]
        :type maxWidth: int
        :rtype: List[str]
        """
        if not words:
            return builder
        line = []
        j = 0
        for i in range(len(words)):
            line.append(words[i])
            l_len = len("".join(line))
            lsp = maxWidth - l_len
            get_last = (i == len(words) - 1)
            if get_last:
                line[-1] += (" " * lsp)
                builder.extend(line)
                return builder

            too_long = l_len + len(words[i + 1]) + j > maxWidth
            if too_long:
                n_line = self.append_space(line, lsp)
                line = []
                j = 0
                builder.extend(n_line)

            j += 1

        print builder

    @staticmethod
    def append_space(arr, l_space):
        if len(arr) == 1:
            arr[0] += l_space * " "
            return arr

        pt, rmd = divmod(l_space, len(arr) - 1)
        for i in range(len(arr)-1):
            arr[i] += (" " * pt)
        for i in range(len(arr)-1):
            if rmd:
                arr[i] += " "
                rmd -= 1

        return arr
```
