{
  "title": "一个完整的Python结构",
  "profile": "一个简单的setup.py编写",
  "create_at": "2017-03-10T12:10:01",
  "update_at": "2017-03-10T12:10:01"
}
# 一个完整Python结构

## 说明
有时候Python需要以包的形式进行分发，就需要使用`setup.py`进行打包，
这里给一个简单的示例

运行就可以看到打包的程序
```bash
python setup.py build
```

具体看了下`django`的写法

## 文件夹结构
在__init__.py中一般初始化时使用__all__ = ['Fop']进行初始化，
例如, libs/__init__.py下文件可能是这样的:
```python
from .Fop import Fop

__all__ = ['Fop']

```

下面是目录结构:

```txt
|   main.py
|   README.rst
|   setup.py
|   
+---app               
|   |   __init__.py             ## 这里是写模块源码的目录, 其他目录都是生成的。
|   |   
|   +---libs
|   |       demo.py
|   |       Fop.py
|   |       __init__.py
|   |       
|   \---utils
|           path.py
|           tools.py
|           __init__.py
|           
+---app.egg-info
|       dependency_links.txt
|       PKG-INFO
|       SOURCES.txt
|       top_level.txt
|       
+---build
|   +---bdist.win32
|   \---lib
|       \---app
|           |   __init__.py
|           |   
|           +---libs
|           |       demo.py
|           |       Fop.py
|           |       Tools.py
|           |       __init__.py
|           |       
|           \---utils
|                   get_path.py
|                   path.py
|                   tools.py
|                   __init__.py
|                   
\---dist
        app-1.0-py2.7.egg
        app-1.0.zip               #win下是zip, linux下是tar, 里面就是源码
        
```

## setup.py文件
1. 主要是packages的值, 下面find_packages函数会查找name里面的模块。如果setup里面`name = 'app'`,
则`app/`文件夹下需要有`__init__.py`文件,find_packages会递归查找里面的模块.
2. 使用`python setup.py install`安装
3. 使用`python setup.py sdist`创建打包, 安装后我们site-packages下就会有egg生成.
4. 可以覆盖安装, 不过不推荐, 也可以`pip uninstall app`进行卸载.

下面是示例文件
```python
import sys
from os.path import abspath, join, exists
from distutils.sysconfig import get_python_lib

from setuptools import find_packages, setup

EXCLUDE_FROM_PACKAGES = ['app/bin']

if "install" in sys.argv:
    lib_paths = [get_python_lib()]

    if lib_paths[0].startswith('/usr/lib/'):
        lib_paths.append(get_python_lib(prefix="/usr/local"))

setup(
    name = 'app',
    version = '1.0',
    author = 'GreyHound',
    author_email = '635044633@qq.com',
    url = 'https://yuanronghhh.github.io/ghpage/',
    packages = find_packages(exclude=EXCLUDE_FROM_PACKAGES),
    license = 'MIT',
    keywords = ['python package demo'],
    py_modules = ['app'],
)
```

## 参考
[django](https://github.com/django/django.git)
[python doc](https://www.python.org)
