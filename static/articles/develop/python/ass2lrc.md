{
  "title": "将ass转换成lrc的命令行脚本",
  "profile": "将ass文件转换成lrc的python命令行脚本",
  "create_at": "2021-07-12T00:00:00",
  "update_at": "2021-07-12T00:00:00"
}

## 介绍
使用`aegisub`制作后，可以使用这个脚本转成`lrc`文件放到手机上面让音乐播放器读取。

> 1. 因为lrc没有结束时间，所以转换后字幕结束时间信息将会丢失。
> 2. 时间格式将会转换, 所以时间信息也会丢失部分。

## 完整代码
```python
from pathlib import Path
from datetime import datetime
import argparse
import re
import os
import sys


class AssConverter:
    @staticmethod
    def to_lrc(fin, fout):
        with open(fin, encoding="utf-8", mode="r") as fip, \
            open(fout, encoding="utf-8", mode="w") as fop:
            lasttm = None
            for line in fip.readlines():
                if not line.startswith("Dialogue"):
                    continue

                line = re.sub("{.*}", "", line).split(",")
                tm = datetime.strptime(line[1], "%H:%M:%S.%f")
                tm2 = datetime.strptime(line[2], "%H:%M:%S.%f")

                line1 = "%s.%.3d" % (tm.strftime("%M:%S"), (tm.microsecond / 1000))
                line2 = "%s.%.3d" % (tm2.strftime("%M:%S"), (tm.microsecond / 1000))

                rline = "[%s]%s" % (line1, line[9])
                lasttm = "[%s]" % line2
                fop.write(rline)
            fop.write(lasttm)

def cmd_help():
    print('python3 ass2lrc.py "<*.ass>" -o "<*.lrc>"')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="""\
ass 转换成 lrc 文件
仅保留开始时间
""", prog="ass2lrc")
    parser.add_argument("-i", dest="ass", help="输入的ass文件")
    parser.add_argument("-o", dest="lrc", help="可选参数,输出的lyric文件,默认和ass同目录")
    parser.add_argument("-f", dest="force", action="store_true", help="覆盖原有文件")
    parser.add_argument("-ext", dest="ext", default="lrc", help="输出文件后缀")

    args = parser.parse_args()

    if len(sys.argv) < 3:
        parser.print_help()
        exit()

    if not args.ass:
        print("-i 参数不能为空")
        exit()

    fin = Path(args.ass)
    if not fin.exists():
        print("输入文件路径不存在")
        exit()

    if not args.lrc:
        args.lrc = Path(fin.parent.joinpath("%s.%s" % (fin.name.strip(fin.suffix), args.ext)))

    fout = Path(args.lrc)
    if fout.exists() and not args.force:
        print("请添加-f参数覆盖原有文件")
        exit()

    print("converting %s => %s" % (fin.as_posix(), fout.as_posix()))
    AssConverter.to_lrc(fin.as_posix(), fout.as_posix())
```
