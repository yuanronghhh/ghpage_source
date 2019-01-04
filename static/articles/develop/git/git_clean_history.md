{
  "title": "Git里面清空某个文件的全部历史",
  "profile": "之前因为文档随git一起提交到了服务器，导致项目极大，所以清除时需要到服务器上进行清除才行",
  "tags": ["GIT"],
  "create_at": "2017-03-10T12:10:01",
  "update_at": "2018-12-25T00:00:00"
}
# git 清空某个文件历史

### 参考
__[重写历史](https://git-scm.com/book/zh/v1/Git-%E5%B7%A5%E5%85%B7-%E9%87%8D%E5%86%99%E5%8E%86%E5%8F%B2)__
__[git-filter-branch](https://www.git-scm.com/docs/git-filter-branch)__


> 注意: 备份以后再操作项目, 以防止数据丢失

```shell
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch 文件名'
--prune-empty --tag-name-filter cat -- --all

git push origin master --force

rm -rf .git/refs/original/

git reflog expire --expire=now --all

git gc --prune=now

git gc --aggressive --prune=now
```


--index-filter: 重写索引, 但不check out整个树, 更快。
--ignore-unmatch: 
--prune-empty: 生成空的commits, 使树像未改动一样, 不能和--commit-filter一起使用。
删除仅有一个或零个未修剪父级的commits
