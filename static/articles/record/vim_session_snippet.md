{
  "title": "VIM保存session",
  "profile": "VIM保存会话配置脚本",
  "create_at": "2021-05-01T00:00:00",
  "update_at": "2021-05-03T00:00:00"
}

# VIM保存会话

## 介绍
需要实现会话保存和载入命令, `SaveSession`, `OpenSession`。会话可以带一个文件参数
去保存会话内容，否则使用默认的`s.vim`保存。

## 实现

1. 配置准备
首先需要配置会话保存的内容, 设置一个保存的目录，这里我使用了vim配置文件夹下
的`session`文件夹保存。

```vimscript
set ssop=blank,buffers,curdir,folds,tabpages,terminal
let g:vim_session = g:vim_home."/session"
```

2. 创建会话
创建会话时，可以指定一个文件参数，这里默认为`s.vim`, 文件名短方便输入。
```vimscript
function LeaveSession(sfile)
  let l:sfile = a:sfile
  if strlen(a:sfile) == 0
     let l:sfile = "s.vim"
  endif

  exec "mks! ".g:vim_session."/".l:sfile
endfunction
```

3. 载入会话
```vimscript
function LoadSession(sfile)
  let l:sfile = a:sfile
  if strlen(a:sfile) == 0
     let l:sfile = "s.vim"
  endif

  exec "source ".g:vim_session."/".l:sfile
endfunction
```

4. 配置命令
```vimscript
command! -nargs=? OpenSession :call LoadSession("<args>")
command! -nargs=? SaveSession :call LeaveSession("<args>")
```

## 所有代码
```vimscript
set ssop=blank,buffers,curdir,folds,tabpages,terminal
let g:vim_session = g:vim_home."/session"

function LeaveSession(sfile)
  let l:sfile = a:sfile
  if strlen(a:sfile) == 0
     let l:sfile = "s.vim"
  endif

  exec "mks! ".g:vim_session."/".l:sfile
endfunction

function LoadSession(sfile)
  let l:sfile = a:sfile
  if strlen(a:sfile) == 0
     let l:sfile = "s.vim"
  endif

  exec "source ".g:vim_session."/".l:sfile
endfunction

command! -nargs=? OpenSession :call LoadSession("<args>")
command! -nargs=? SaveSession :call LeaveSession("<args>")
```
