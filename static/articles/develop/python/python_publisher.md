{
  "title": "Python发布器",
  "profile": "Python发布器,可以发布到ftp和将文件打包成zip",
  "create_at": "2021-05-14T00:00:00",
  "update_at": "2021-05-14T00:00:00"
}
# 一个简易的Python发布器

## 说明

一个简单的发布程序，可以将源路径中的文件进行发布。

### 有以下几点需要注意:
1. 程序仅支持`python3`。
2. 推荐使用`publish.json`的配置文件，就不需要每次指定发布的文件。
3. 脚本默认读取`publish.json`中的配置，使用命令行可以覆盖其中配置。
4. `ftp`配置需要完整的`ftp`路径。

## 软件依赖
```
pip install coloredlogs  用于日志颜色输出，可以注释修改掉。
pip install svn          用于查询svn日志
```

## publish.json格式

1. 对于`binFiles`格式，可以留空，程序拷贝时将获取源目录中所有的文件进行。
2. 拷贝时携带了时间信息，可以用于对比文件是否有更新。

```json
{
  "publishRoot": "D:/PUBLISH",
  "version": "20210505",
  "ftpURI":"ftp://user:password@192.168.1.19:3333",
  "projectList": [{
      "projectName": "Project1",
      "srcDirectory": "D:/Code/v3.0-branch/Project1",
      "binFiles": [
        "Template/Demo.docx",
        "bin/Demo.XML",
        "bin/Demo.dll"
      ]
    }, {
      "projectName": "Project2",
      "srcDirectory": "D:/Code/Project1/dist",
      "binFiles": null
    }
  ]
}
```

## 使用方法
- 发布到本地 
  `python publish.py -p "<项目名称>" -l`
- 发布到`FTP` 
  `python publish.py -p "<项目名称>" --ftp`
- 发布到`zip`
  `python publish.py -p "<项目名称>" --zip "zipName"`
- 将zip发布到ftp服务器 
  `python publish.py -p "<项目名称>" --zip "zipName" && --ftp` 
- 根据`svn`版本发布静态文件。
有时需要根据`svn`中日志从某个 版本/时间 到最新的 版本/时间 发布，这个功能则比较有用。
首先，需要配置文件的`projectList`中需要配置以下几个参数,
1. `srcDirectory`: 指定svn查找日志的目录。
2. `svnExtentions`： 指定svn复制的文件后缀。
然后, 执行命令:
```
python publish.py -l --svnvdiff 1700:1876
或者
python publish.py -l --svntdiff 2021-01-01:2021-01-02
```

> 如果`publish.json`中已经配置了`binFiles`,发布时将 `svn静态文件` + `binFiles` 一起发布.
> 发布到`zip`时, `python`会自动加上时间生成的版本号，也可以用`-v`指定。

## 完整代码
```python
#!/bin/python
import shutil
import os
import logging
import zipfile
import re
import json
import sys

import coloredlogs
import svn.local

from ftplib import FTP
from pathlib import Path
from datetime import datetime

# logging.basicConfig(format="%(levelname)s %(message)s", level=logging.DEBUG)

coloredlogs.install(fmt="%(levelname)s %(message)s", level=logging.DEBUG)

publishInfo = None

def arg_equal(arg, para):
    return (arg == ("-" + para)) or (arg == ("--" + para))

def index_args(args, para, isflag = False):
    if not args:
        return -1

    for i in range(0, len(args)):
        arg = args[i]

        if isinstance(para, list):
            if len([p for p in para if arg_equal(arg, p)]) == 0:
                continue

        elif isinstance(para, str):
            if arg != ("-" + para) and arg != ("--" + para):
                continue
        else:
            pass

        if isflag:
            return i

        if (i + 1 >= len(args)):
            return -1

        if args[i + 1].startswith("-"):
            return -1

        return i + 1

    return -1

class FTPHelper(FTP):

    def __init__(self, uri = None):
        super().__init__()
        self.ftp_init(uri)

    def ftp_init(self, server):
        if not server:
            return

        uri = re.match(r"(?P<schema>\w*)://(?P<user>\w+){0,1}:(?P<password>\w+){0,1}@(?P<host>[\d\.0-9]*):(?P<port>\d*)", server)
        if not uri:
            raise Exception("Not correct ftp uri format: %s" % (server))

        if uri[1] != "ftp":
            raise Exception("Schema not ftp")

        self.connect(uri[4], int(uri[5]))
        self.login(uri[2], uri[3])
        self.encoding = "gbk"

    def checkExist(self, path):
        try:
            self.cwd("/%s" % path.as_posix())
            return True
        except Exception as e:
            return False

    def mkdirs(self, path):
        if self.checkExist(path):
            return True

        if path.as_posix() == path.parent.as_posix():
            return True

        if not self.mkdirs(path.parent):
            return False

        self.cwd("/%s" % path.parent.as_posix())
        # logging.debug("Making directory: %s" % (path.as_posix()))
        self.mkd("%s" % path.name)

        return True

    def upload(self, absBin, pubBin):
        if not pubBin:
            logging.warning("%s path not correct" % (b))
            return False

        if not self.mkdirs(pubBin.parent):
            return False

        logging.debug("uploading: %s" % (pubBin))

        fp = open(absBin, mode="rb")
        self.cwd("/%s" % (pubBin.parent.as_posix()))
        self.storbinary("STOR %s" % (pubBin.name), fp)
        fp.close()

class Publisher:

    def __init__(self, rootPath, srcDirectory, ftpURI = None):
        self.rootPath = rootPath if rootPath else ""
        self.srcDirectory = Path(srcDirectory)

        self.tServer = None
        if ftpURI:
            self.tServer = FTPHelper(ftpURI)

    def local_init(self, publishDirectory):
        if not publishDirectory.exists():
            os.makedirs(publishDirectory)

        if not publishDirectory:
            logging.error("Failed to create project path: %s" % (publishDirectory))
            return

    @staticmethod
    def get_files_from_directory(path):
        sPath = Path(path)
        fs = []
        if not sPath.exists():
            return fs

        for dp, drs, fns in os.walk(path):
            p = Path(dp)

            for f in fns:
                 fs.append(p.joinpath(f).as_posix())

        return fs

    def gen_zip_from_directories(self, zipName, dstDirectories, withRootPath = False):
        if not zipName or not dstDirectories:
            raise Exception("a zip name and directory list should be given.")
            return

        if not Path(zipName).parent.exists():
            raise Exception("zip parent directory not exsit.")
            return

        zp = zipfile.ZipFile(zipName, 'w')
        for d in dstDirectories:
            sPath = Path(d)

            if not sPath.exists():
                logging.warning("Not exist directory when generate zip: %s" % (sPath.as_posix()))
                continue

            for dp, drs, fns in os.walk(sPath):
                p = Path(dp)

                for f in fns:
                    pubBin = p.joinpath(f)

                    if not pubBin.exists():
                        logging.warning("Not exist file: %s" % (pubBin))
                        continue

                    if withRootPath:
                        zRelName = "%s/%s/%s" % (self.rootPath, p.as_posix().lstrip(sPath.parent.as_posix()), f)
                    else:
                        zRelName = "%s/%s" % (p.as_posix().lstrip(sPath.parent.as_posix()), f)

                    logging.debug("Adding to zip: %s" % (zRelName))
                    zp.write(pubBin.as_posix(), zRelName, compress_type=zipfile.ZIP_LZMA)

        zp.close()
        logging.info("Create zip success: %s" % zipName)

    def gen_zipfile(self, zipName, rootPath, binFiles, withRootPath = True):
        if not zipName:
            logging.warning("A zip name should be given.")
            return

        zp = zipfile.ZipFile(zipName, 'w')

        for f in binFiles:
            absBin = Path(rootPath).joinpath(f)
            if not absBin.exists():
                logging.warning("Not exist file: %s" % (pubBin.as_posix()))
                continue

            if withRootPath:
                zRelName = "%s/%s" % (self.rootPath, f)
            else:
                zRelName = "%s" % (f)

            logging.debug("Adding to zip: %s" % (zRelName))
            zp.write(absBin.as_posix(), zRelName, compress_type=zipfile.ZIP_BZIP2)

        zp.close()
        logging.info("Create zip success: %s" % zipName)

    def publish_to_ftp(self, binFiles, server, withRootPath = True):
        try:
            self.tServer = FTPHelper(server)
        except Exception as err:
            logging.error(err.args[0])
            return

        for b in binFiles:
            absBin = self.srcDirectory.joinpath(b)

            if not absBin.exists():
                logging.warning("Not exist file: %s" % (absBin))
                continue

            if withRootPath:
                pubBin = Path("%s/%s" % (self.rootPath, b))
            else:
                pubBin = Path("%s" % (b))

            self.tServer.upload(absBin, pubBin)

        logging.info("Publish success: %s:%d" % (self.tServer.host, self.tServer.port))

        if self.tServer:
            self.tServer.close()

    @staticmethod
    def copy_to_local(absBin, pubBin):
        if not pubBin.parent.exists():
            # logging.debug("Making directory: %s" % (pubBin.parent.as_posix()))
            os.makedirs(pubBin.parent.as_posix())

        return shutil.copy2(absBin.as_posix(), pubBin.as_posix())

    def publish_local(self, binFiles, publishDirectory, withRootPath = True):
        self.local_init(publishDirectory)

        if withRootPath is None:
            withRootPath = True

        for b in binFiles:
            absBin = self.srcDirectory.joinpath(b)

            if not absBin.exists():
                logging.warning("Not exist file: %s" % (absBin))
                continue

            if withRootPath:
                pubBin = publishDirectory.joinpath(self.rootPath).joinpath(b)
                logging.debug("Copying: %s/%s" % (self.rootPath, b))
            else:
                pubBin = publishDirectory.joinpath(b)
                logging.debug("Copying: %s" % (b))

            Publisher.copy_to_local(absBin, pubBin)

        logging.info("Publish success: %s" % (publishDirectory.as_posix()))

def get_all_files(path):
    wk = Path(path)
    files = []

    if not wk.exists():
        return []

    for dp, drs, fns in os.walk(wk):
        for f in fns:
            fFull = Path(dp).joinpath(f)
            files.append(fFull.as_posix()[len(wk.as_posix())+1:])

    return files

def get_svn_vnumber_by_time(svnLocal, svnDiffTime):
    if not svnLocal:
        return None

    stime = None
    etime = None
    try:
        vTime = svnDiffTime.split(":")
        stime = datetime.strptime(vTime[0], "%Y-%m-%d")
        etime = datetime.strptime(vTime[1], "%Y-%m-%d")
    except Exception as err:
        logging.error(err.args[0])
        return

    vs = []

    sm = svnLocal.log_default(stime, etime)
    for l in sm:
        vs.append(l.revision)

    if len(vs) < 2:
        logging.error("svntdiff too close")
        return

    vNumber = [vs[0], vs[-1]]
    return vNumber

def get_svn_vnumber_by_version(svLocal, svnDiffVersion):
    try:
        vNumber = [int(n) for n in svnDiffVersion.split(":")]
        if len(vNumber) != 2:
            raise Exception("Two version number need to be given")

        return vNumber
    except Exception as err:
        logging.error(err.args[0])
        return None

def get_svn_files_by_version(svnLocal, v1, v2):
    if not svnLocal:
        return []

    exts = ["cshtml", "js", "css", "xlsx", "xls", "doc", "docx",
            "jpeg", "jpg", "png", "ico"]

    sm = svnLocal.diff_summary(v1, v2)
    lFiles = [i["path"] for i in sm if Path(i["path"]).suffix.lstrip(".") in exts]
    return lFiles

# GroupAPI 发布
def publish_it(projectInfo):
    logging.info("Start publish")

    publishLocal = publishInfo["publishLocal"] if "publishLocal" in publishInfo else False
    publishFTP = publishInfo["publishFTP"] if "publishFTP" in publishInfo else False
    publishZIP = publishInfo["publishZIP"] if "publishZIP" in publishInfo else False

    directoriesToZIP = publishInfo["directoriesToZIP"] if "directoriesToZIP" in publishInfo else None
    publishDirectory = publishInfo["publishDirectory"] if "publishDirectory" in publishInfo else None
    publishRoot = publishInfo["publishRoot"] if "publishRoot" in publishInfo else None
    version = publishInfo["version"] if "version" in publishInfo else None
    withRootPath = publishInfo["withRootPath"] if "withRootPath" in publishInfo else True
    rootPath = publishInfo["rootPath"] if "rootPath" in publishInfo else None
    svnDiffVersion = publishInfo["svnDiffVersion"] if "svnDiffVersion" in publishInfo else None
    svnDiffTime = publishInfo["svnDiffTime"] if "svnDiffTime" in publishInfo else None
    zipName = publishInfo["zipName"] if "zipName" in publishInfo else None
    zipVersion = publishInfo["zipVersion"] if "zipVersion" in publishInfo else None
    ftpURI = publishInfo["ftpURI"] if "ftpURI" in publishInfo else None
    zipPath = None
    binFiles = []

    if not version:
        version = datetime.now().strftime("%Y%m%d%H%M")

    if not zipVersion:
        zipVersion = datetime.now().strftime("%Y%m%d%H%M")

    # 如果单独配置发布目录，则使用单独，否则使用默认 发布目录 + 版本 + 项目名称,
    if publishDirectory:
        publishDirectory = Path(publishDirectory)
        if not publishDirectory.exists():
            logging.error("publishDirectory not exist")
            return

    elif publishRoot:
        publishRoot = Path(publishRoot)

        if not publishRoot.exists():
            logging.error("Either publishRoot or publishDirectory parameter is require")
            return

        publishDirectory = publishRoot.joinpath(version)
    else:
        logging.error("Either publishRoot or publishDirectory parameter is require")
        return

    if zipName:
        zipPath = Path(zipName)
        if not zipPath.is_absolute():
            zipPath = Path("%s/%s.zip" % (publishDirectory.as_posix(), "%s%s" % (zipVersion + "-", publishInfo["zipName"])))

    if projectInfo:
        srcDirectory = projectInfo["srcDirectory"] if "srcDirectory" in projectInfo else None
        projectName = projectInfo["projectName"] if "projectName" in projectInfo else None
        binFiles = projectInfo["binFiles"] if "binFiles" in projectInfo else None

        if binFiles is None:
            binFiles = get_all_files(srcDirectory)

        if not projectName:
            logging.error("projectName parameter is required")
            return

        if not srcDirectory:
            logging.error("srcDirectory parameter is required")
            return

        srcDirectory = Path(srcDirectory)
        if not srcDirectory.exists():
            logging.error("srcDirectory not exist")
            return

        if withRootPath:
            if not rootPath:
                rootPath = projectName

        vNumber = None
        svnLocal = None

        if svnDiffTime:
            svnLocal = svn.local.LocalClient(srcDirectory.as_posix())
            vNumber = get_svn_vnumber_by_time(svnLocal, svnDiffTime)
            if not vNumber:
                return

        elif svnDiffVersion:
            vNumber = get_svn_vnumber_by_version(svnLocal, svnDiffVersion)
            if not vNumber:
                return
        else:
            vNumber = None

        if vNumber:
            svnLocal = svnLocal if svnLocal else svn.local.LocalClient(srcDirectory.as_posix())
            lFiles = get_svn_files_by_version(svnLocal, vNumber[0], vNumber[1])
            binFiles.extend(lFiles)

        pub = Publisher(rootPath, srcDirectory.as_posix())
        if publishZIP and zipName:
            pub.gen_zipfile(zipPath.as_posix(), srcDirectory, binFiles, withRootPath)

        if publishLocal:
            pub.publish_local(binFiles, publishDirectory, withRootPath) # 本地发布
    else:
        pub = Publisher(rootPath, publishDirectory)
        if zipName and directoriesToZIP:
            try:
                dirs = [publishDirectory.joinpath(i).as_posix() for i in directoriesToZIP.split(",")]
                pub.gen_zip_from_directories(zipPath.as_posix(), dirs, False)
            except Exception as err:
                logging.error(err.args[0])
                return
    if publishFTP:
        pub.publish_to_ftp(binFiles, ftpURI, withRootPath)

    if binFiles == []:
        logging.warning("No file to copy")
        return

def print_help():
    hDesc = """\
说明:
    一个发布脚本, 有三种方式，
        1. 发布到local  --local参数.
        2. 发布到ftp    --ftp参数.
        3. 发布到zip    --zip参数.
        4. --zip && --ftp 可以将zip发布到ftp服务器
    通过指定 源目录(-s), 目标目录 (-d) 即可发布，目标可以为以上三种

用法: PROG [参数]

参数：
    -l --local                              发布到本地
    [-f | --ftp <ftp-uri>]                  FTP配置
    -z | --zip <zip-name>                   发布到zip文件中
    -m <d1,d2>                              将多个发布目录中的文件夹打包成zip，可以配合-z参数
    -p | --project <project-name>           必要参数
    -v --version <version>                  发布版本, 默认当前时间精确到分
    --zip-directories <d1,d2>               根据文件夹，打包到zip中
    --svnvdiff v1:v2                        根据svn版本，发布静态文件
    --svntdiff t1:t2                        根据svn时间，发布静态文件, 精确到天
    [-d <publish-path>]                     本地发布路径
    [-s <src-path>]                         本地源路径

ftp-uri:
    ftp://<user>:<password>@<host>:<port>

"""
    print(hDesc)

def set_config(cName):
    global publishInfo
    cfg = open(cName, mode="r", encoding="utf-8")
    publishInfo = json.loads(re.sub("#[^\n]*","",cfg.read()))
    cfg.close()

def main():
    argv = sys.argv

    projectList = []
    projectInfo = None

    set_config("publish.json")

    # ZIP
    idx = index_args(argv, ["z", "zip"], True)
    if idx > -1:
        publishInfo["publishZIP"] = True

        idx = index_args(argv, ["z", "zip"])
        if idx > -1:
            publishInfo["zipName"] = argv[idx]

            idx = index_args(argv, "zip-version")
            if idx > -1:
                publishInfo["zipVersion"] = argv[idx]

    # FTP
    idx = index_args(argv, ["f", "ftp"], True)
    if idx > -1:
        publishInfo["publishFTP"] = True

        idx = index_args(argv, ["f", "ftp"])
        if idx > -1:
            publishInfo["ftpURI"] = argv[idx]

    # publish Local
    idx = index_args(argv, ["l", "local"], True)
    if idx > -1:
        publishInfo["publishLocal"] = True

    # 本地发布时 版本为时间
    idx = index_args(argv, ["v", "version"])
    if idx > -1:
        publishInfo["version"] = argv[idx]

    # publishDirectory
    idx = index_args(argv, "d")
    if idx > -1:
        projectInfo["publishDirectory"] = argv[idx]

    # root-path
    idx = index_args(argv, "root-path")
    if idx > -1:
        publishInfo["rootPath"] = argv[idx]
        if argv[idx] == "":
            publishInfo["withRootPath"] = False

    # ------------------------------------------------------------------
    # mutiple directory to zip
    idx = index_args(argv, "m")
    if idx > -1:
        publishInfo["directoriesToZIP"] = argv[idx]

        publish_it(None)
        return

    # projectName
    idx = index_args(argv, ["p", "project"])
    projectName = argv[idx] if idx > -1 else None
    if projectName is None:
        print_help()
        return

    if "projectList" not in publishInfo:
        logging.error("%s is required" % ("projectList"))
        return

    projectList = publishInfo["projectList"]

    prjNames = []
    for prj in projectList:
        if "projectName" not in prj:
            logging.error("%s is required in project" % ("projectName"))
            return

        prjNames.append(prj["projectName"])
        if prj["projectName"] == projectName:
            projectInfo = prj
            break
    else:
        pNames = ", ".join(prjNames)
        logging.error("Not find %s in %s" % (projectName, pNames))
        return

    # srcDirectory
    idx = index_args(argv, "s")
    if idx > -1:
        projectInfo["srcDirectory"] = argv[idx]

    # svntdiff
    idx = index_args(argv, "svnvdiff")
    if idx > -1:
        publishInfo["svnDiffVersion"] = argv[idx]
    else:
        idx = index_args(argv, "svntdiff")
        if idx > -1:
            publishInfo["svnDiffTime"] = argv[idx]


    publish_it(projectInfo)

if __name__ == '__main__':
    main()
```
