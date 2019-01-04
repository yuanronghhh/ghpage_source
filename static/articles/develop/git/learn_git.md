{
  "title": "Git笔记",
  "profile": "Git是一个分布式版本控制系统(vcs)。",
  "create_at": "2017-03-10T12:10:01",
  "update_at": "2017-03-10T12:10:01"
}
# Git笔记

Git历史: __[点击Git](https://github.com/git/git/graphs/contributors)__
下载Git: __[便携版Git(32bit)](https://git-scm.com/download/win)__

### 简介

*__定义__*：版本控制是一种记录一个或若干文件内容变化，以便将来查阅特定版本修订情况的系
统。

*__解释__*：Git是一个软件集合，它可以跟踪代码的变更，也可以根据变更进行撤回，支持很多  
各种文本文件的管理,包括但不限于版本记录(git tag)、回溯(git reset)、版本比较(git  
diff)。

### 基本命令
所有命令都可以使用--help参数查询,例如：git reset --help会显示帮助(英文)

1. `git status`
最常用命令,查询状态,红色需要引起注意,一般指有文件没有跟踪(`git add`),或命令执行
出错了.

2. `git reset`
git reset --hard 常用,经常直接撤回代码.
git reset --soft 常用,用于重写日志.
git reset --mix

3. `git log`

4. `git add .` && `git add -A`

5. `git commit -m '修复了运算错误'`

6. `git diff mybranch origin/master`

7. `git reflog`
查询近期操作日志,一般用来reset到未来的状态

8. `git show`

9. `git push`

9. `git pull` && `git fetch`
pull origin 直接拉取数据,覆盖本地
fetch origin 不覆盖,然后`git diff`比较后确定是否用`git merge`合并

10. `git remote`
其实主要使用remote指定远程仓库的路径, 方便以后不用输入很长一段链接地址.

`git remote -v`查询,v为verbose(详情)之意
可以使一个项目指向多个托管平台
`git remote add coding http://.....`
`git remote add github http://.....`
以后就可以使用github选择推到哪个平台了

11. `git config`
开始设置的名字和邮箱用这个.
`git config --global user.name 'greyhound'`

12. `git rebase`
为了项目容易维护,重新整理时间线,下面工作流图：
rebase后将c放到A-B之间,e放到D-F之间,最后就是一条直线了.

12. `gitk` && `git gui`
gitk是的官方GUI(带图形界面)版本,一般用来查看历史.
例如: gitk main.js

13. `git checkout feature/main.js`
放弃本次对main.js的更改,重会上一次hash.
`git checkout .`表示放弃当前目录下的更改,常用.

14. `git branch` 分支操作
添加 `git branch feature`
查看 `git branch -a`
切换 `git checkout feature`

### Git 工作流

```code
branch --- master | --- A --- B --- D ---- F --- G
       |          |      \                /
       |_ feature |       C ------------ E
                  +-----------------------------------
                       |  |   |     |   |  |     | 
           4月份      02 03   04    05  06 07    08
```

__解释__：
上图中,4月份我们02号开了项目,03项目里面新加了伙伴,我们使用`git branch`新建了分支
开发新的feature.

原来的开发依然建立在master上经历B--D,需要注意的是,master不应随意改动feature下的
文件,反之亦然.否则会产生冲突.

06号的时候,feature开发完毕,准备开始合并(`git fetch` && `git merge`),合并过程可以
是先feature推送(`git push`),  master使用三方托管平台合并或自己本地fetch后merge,再push,最终得
到G.
