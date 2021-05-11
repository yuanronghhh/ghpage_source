{
  "title": "VIM配置文件",
  "profile": "个人VIM配置备份",
  "create_at": "2018-12-31T12:10:01",
  "update_at": "2021-05-01T16:31:00"
}
# VIM配置文件

## code
```vimscript
behave xterm
runtime ftplugin/man.vim

set nocompatible

syntax on
filetype on
filetype plugin on
filetype indent on
set clipboard=unnamedplus
set showmatch
set guifont=Fixedsys\ Excelsior\ 3.01\ 12
set guioptions=r
"set spell
set fileformats=unix,dos,mac
set fileencoding=utf-8
set fileencodings=utf-8,gb18030,gb2312,cp936,gbk,ucs-bom,shift-jis
set showcmd
set number
set nowrap
set history=100
set foldcolumn=1
set shiftwidth=2
set tabstop=2
set softtabstop=2
set smarttab
set mouse=a
set hlsearch
set expandtab
set incsearch
set list
set lcs=tab:>-,trail:-,nbsp:~
set ruler
set cursorline
set cursorcolumn
set guicursor=a:block-blinkoff0
set wildmenu
set autoread
set autoindent
set smartindent
set nobackup
set backspace=start,indent,eol
set whichwrap+=<,>,h,l
set colorcolumn=80
set scrolloff=3
set novisualbell
set t_vb=
set fdm=syntax
set t_Co=256
if has("gui_running")
  set columns=120 lines=30
endif
set undofile
set ssop=blank,buffers,curdir,folds,tabpages,terminal

let g:vim_home = expand("~/.vim")
let &undodir = g:vim_home."/undodir"
let g:vim_plugin = g:vim_home."/plugins"
let g:vim_ropepath = g:vim_home."/rope"
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

function! ClosePair(char)
    if getline('.')[col('.') - 1] == a:char
        return "\<Right>"
    else
        return a:char
    endif
endfunction

inoremap < <><ESC>i
inoremap > <c-r>=ClosePair('>')<CR>
inoremap ( ()<ESC>i
inoremap ) <c-r>=ClosePair(')')<CR>
inoremap } <c-r>=ClosePair('}')<CR>
inoremap [ []<ESC>i
inoremap ] <c-r>=ClosePair(']')<CR>
inoremap " ""<ESC>i
inoremap ' ''<ESC>i
inoremap <c-o> <ESC>o
inoremap { {}<ESC>i

nnoremap <C-h> <C-w>h
nnoremap <C-j> gt
nnoremap <C-k> gT
nnoremap <C-l> <C-w>l
nnoremap <C-s> :w<cr>

map <F2> :%!python3 -m json.tool<cr>
map <F3> :tabnew<cr>
map <F4> :close<cr>

let NERDTreeShowHidden=1
let NERDTreeShowLineNumbers=0
let NERDTreeAutoDeleteBuffer=1

let g:pymode = 1
let g:pymode_lint = 0
let g:pymode_folding = 0
let g:pymode_rope = 1
let g:pymode_rope_project_root = g:vim_ropepath
let g:pymode_rope_autoimport = 1
let g:pymode_python = 'python3'

call vundle#begin(g:vim_plugin)
Plugin 'https://github.com/python-mode/python-mode.git'
Plugin 'https://github.com/majutsushi/tagbar.git'
call vundle#end()

if has("gui_running")
    colorscheme materialtheme
  else
    colorscheme molokai
endif

au! BufRead *.vs,*.vert,*.glsl,*.frag :set ft=c
au! BufRead *.vue :set ft=html
au! BufRead *.vala :set ft=cpp
au! BufRead *.cst :set ft=javascript
command! -nargs=? OpenSession :call LoadSession("<args>")
command! -nargs=? SaveSession :call LeaveSession("<args>")
```
