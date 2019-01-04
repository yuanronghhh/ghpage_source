{
  "title": "python中双斜线(//)和单斜线(/)",
  "profile": "Python3中`/`和Python2.7中有些许区别，需要注意",
  "create_at": "2017-03-10T12:10:01",
  "update_at": "2017-03-10T12:10:01"
}
# python中双斜线(//)和单斜线(/)

## 介绍
python中`//`用于整数整除(integer division),`/`用于浮点数除(floating-point division)
能用`Python3`尽量使用不用`Python2.7`吧
对于小数，尽量使用整数替代，因为`Python3`整数没有上限了。

## python 2.x
```txt
>>> 10/3
3
>>> # to get a floating point number from integer division:
>>> 10.0/3
3.3333333333333335
>>> float(10)/3
3.3333333333333335
```
## python 3.x
```txt
>>> 10/3
3.3333333333333335
>>> 10//3
3
```

## 需要注意
1. Add from __future__ import division to your files
2. Update any division operator as necessary to either use // to use floor division or continue using / and expect a float
The reason that / isn't simply translated to // automatically is that if an object defines its own __div__ method but not __floordiv__ then your code would begin to fail.

python3里面5 / 2 == 2.5而不是2需要使用，需要使用 from __future__ import
division, 或interpreter运行时使用-Q参数。

In Python 3, 5 / 2 == 2.5 and not 2; all division between int values result in a float. This change has actually been planned since Python 2.2 which was released in 2002. Since then users have been encouraged to add from __future__ import division to any and all files which use the / and // operators or to be running the interpreter with the -Q flag. If you have not been doing this then you will need to go through your code and do two things:
