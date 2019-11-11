{
  "title": "部署一个空的Git项目",
  "profile": "部署空项目，设置hook，在提交后直接更新到部署的项目上",
  "tags": ["GIT"],
  "create_at": "2019-03-13T00:22:32",
  "update_at": "2019-03-13T00:22:32"
}
# 部署空Git项目，添加钩子

## 说明

### 使用

1. 将`deply_git_server.sh`和`post_update.sample`放置到同一目录。
2. 修改脚本`deply_git_server.sh`里面的邮箱。
3. 直接执行`./deply_git_server.sh`文件。

执行后，如果名称设置成`hello`, 会生成`development_hello/`和`hello/` 项目，`hello`是`git`里的空项目，
`development_hello/` 是用来部署文件，里面已经初始化了一条日志并切换到了dev分支

如果服务器将`hello`提交代码，代码会自动同步到`development_hello`中，就可以直观看到
文件结构了。

### 提交代码后自动触发

脚本本身用的是`git`的`hook`机制
可以在`hello`项目里面找到`.git/hooks/`里面找到`post-update`这个文件，添加命令即可，
例如，想提交代码后执行`npm build`，直接添加在`post-update`里面即可， 远程提交时，
命令错误也会输出到控制台上面的。

### deply_git_server.sh
```bash
#!/bin/bash
# 功能：仅用于在服务器上面初始化git
# 生成project_name_bare: 空的项目目录,用于客户端git推送
#     dev_dir: 项目开发启动的目录

prefix="development"
cwd=`pwd`
script_dir="$cwd"
git_name="example"
git_email="example@qq.com"

echo -e "\

please prepare these things:

1. open this script and modify variable git_name and git_email on the top.
2. prepare two file deploy_git_server.sh file and post_update.sample file
3. check the check the project name directory has exsited or not.
4. check you have install essential softwares like git.

the project directory will like below:

./hello
./development_hello

this will overwrite post_update.sample
I won't check it exsited or not.
"

#stty erase‘'^H'
read -p "project_name_bare:" project_name_bare

## config git ##
git config --global user.name "$git_name"
git config --global user.email "$git_email"

## init bare project ##

bare_url="$cwd"\/"$project_name_bare"
mkdir "$project_name_bare"
cd "$project_name_bare"
git init --bare

## init devlopement project ###
dev_dir="$prefix"_"$project_name_bare"

cd "../"
mkdir "$dev_dir"
cd "$dev_dir"
git init
git remote add origin "$bare_url"
touch README.md
echo "init project">README.md
git add .
git commit -m "init"

## update master and create dev branch ##
git push origin master
git checkout -b dev

## deploy post_update hook ##
cd "$script_dir"
cp "post-update.sample" "$project_name_bare/hooks/post-update"
chmod 755 "$project_name_bare/hooks/post-update"
## done ##
echo finished
```

### post-update.sample
```bash
#!/bin/sh
#
# An example hook script to prepare a packed repository for use over
# dumb transports.
#
# To enable this hook, rename this file to "post-update".
#使用方法
#1.  修改后缀和脚本参数(GIT_DIR)
#2.  复制到.git/hook中
#example of making deploy_server sync with product_server
work_dir=`pwd`
bare_dir=`basename $work_dir`
GIT_DIR="../development"_"$bare_dir"
cd $GIT_DIR || exit
unset GIT_DIR
git checkout master
git pull origin master

exec git update-server-info
```
