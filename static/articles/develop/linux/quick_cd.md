{
  "title": "一个可以快速切换的shell脚本函数",
  "profile": "可以快速切换，记录切换历史",
  "create_at": "2018-09-01T00:00:00",
  "update_at": "2019-11-11T00:00:00"
}
# 在shell里可以快速切换目录，来自stackoverflow



## 说明

1. 打印切换目录的历史
```
$ cd --
```
2. 切换到目录，后面是编号，`cd --` 执行后的编号

```
$ cd -1
```

> 代码37行有个`ls -ash ${the_new_dir}`，即切换后会打印文件夹
如果不需要可以删掉

## 脚本

```bash
cd_func ()
{
  local x2 the_new_dir adir index
  local -i cnt

  if [[ $1 ==  "--" ]]; then
    dirs -v
    return 0
  fi

  the_new_dir=$1
  [[ -z $1 ]] && the_new_dir=$HOME

  if [[ ${the_new_dir:0:1} == '-' ]]; then
    #
    # Extract dir N from dirs
    index=${the_new_dir:1}
    [[ -z $index ]] && index=1
    adir=$(dirs +$index)
    [[ -z $adir ]] && return 1
    the_new_dir=$adir
  fi

  #
  # '~' has to be substituted by ${HOME}
  [[ ${the_new_dir:0:1} == '~' ]] && the_new_dir="${HOME}${the_new_dir:1}"

  #
  # Now change to the new dir and add to the top of the stack
  pushd "${the_new_dir}" > /dev/null
  [[ $? -ne 0 ]] && return 1
  the_new_dir=$(pwd)

  #
  # Trim down everything beyond 11th entry
  popd -n +11 2>/dev/null 1>/dev/null
  ls -ash ${the_new_dir}

  # Remove any other occurence of this dir, skipping the top of the stack
  for ((cnt=1; cnt <= 10; cnt++)); do
    x2=$(dirs +${cnt} 2>/dev/null)
    [[ $? -ne 0 ]] && return 0
    [[ ${x2:0:1} == '~' ]] && x2="${HOME}${x2:1}"
    if [[ "${x2}" == "${the_new_dir}" ]]; then
      popd -n +$cnt 2>/dev/null 1>/dev/null
      cnt=cnt-1
    fi
  done
  return 0
}

alias cd=cd_func
alias grep='grep --color=always'
```

## 引用链接
```bash
do ". acd_func.sh"
acd_func 1.0.5, 10-nov-2004
petar marinov, http:/geocities.com/h2428, this is public domain
```
