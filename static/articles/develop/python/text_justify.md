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
# -*- coding: utf-8 -*-

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
words = ["This", "is", "an", "example", "of", "text", "justification."]
maxWidth = 30
builder = []


class Solution(object):
    def fullJustify(self, words, maxWidth):
        """
        :type words: List[str]
        :type maxWidth: int
        :rtype: List[str]
        """
        line = []

        if not words:
            return builder

        wLen = len(words)
        i = 0
        for w in words:
            i += 1
            lLen = len("".join(line))
            minSpace = len(line) - 1

            if lLen + minSpace > maxWidth:
                if lLen > maxWidth:
                    line[i-1] = line[0: maxWidth-1]

                builder.append(self.append_space(line, maxWidth))
                line = []
                continue

            nextLen = lLen + len(words[i-1]) + minSpace + 1
            if nextLen > maxWidth:
                nLine = self.append_space(line, maxWidth)
                builder.append(nLine)
                line = []

            if i == wLen:
                line.append(w)
                builder.append(" ".join(line) + " " * (maxWidth - len("".join(line))))
                line = []
                break

            line.append(w)

        return builder

    @staticmethod
    def append_space(line, maxWidth):
        if not line:
            return ""

        minSpace = len(line) - 1
        lStr = "".join(line)
        lLen = len(lStr)
        sLen = maxWidth - lLen

        if minSpace + lLen > maxWidth:
            raise Exception("Data length %d too long" % (lLen))

        if minSpace > 0:
            pt, m = divmod(sLen, minSpace)
            for i in range(0, len(line)-1):
                line[i] += " " * pt

            line[0] += " " * m
        else:
            line[0] += " " * (sLen)

        return "".join(line)

res = Solution().fullJustify(words, maxWidth)
print("\n".join(res))
```
