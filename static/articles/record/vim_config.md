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
set linespace=-3
set novisualbell
set t_vb=
set fdm=syntax
set t_Co=256
if has("gui_running")
  set columns=120 lines=40
endif
set undofile
set ssop=blank,buffers,curdir,folds,tabpages,terminal

let g:vim_home = expand("~/.vim")
let &undodir = g:vim_home."/undodir"
let g:vim_plugin = g:vim_home."/plugins"
let g:vim_ropepath = g:vim_home."/rope"
let g:vim_session = g:vim_home."/session"

function SaveSession(sfile)
  let l:sfile = a:sfile
  if strlen(a:sfile) == 0
     let l:sfile = "s.vim"
  endif

  if stridx(l:sfile, ".vim") == -1
    let l:sfile = a:sfile.".vim"
  endif

  echo "mks! ".g:vim_session."/".l:sfile
  exec "mks! ".g:vim_session."/".l:sfile
endfunction

function SessionCompelete(A,L,P)
  let alist = map(globpath(g:vim_session, "*", 1, 1), "fnamemodify(v:val, ':p:t')")
  return join(alist, "\n")
endfunction

function OpenSession(sfile)
  let l:sfile = a:sfile

  if stridx(a:sfile, ".vim") == -1
    let l:sfile = a:sfile.".vim"
  endif

  if strlen(a:sfile) == 0
     let l:sfile = "s.vim"
  endif

  echo "source ".g:vim_session."/".l:sfile
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
nnoremap <F2> :YcmCompleter GoTo<CR>
nnoremap <F3> :tabnew<cr>
nnoremap <F4> :close<cr>
nnoremap <F5> :PymodeRun<cr>
nnoremap <F6> :%!python3 -m json.tool<cr>
nmap K <Plug>ManPreGetPage

let g:ycm_server_python_interpreter = 'python3'
let g:ycm_goto_buffer_command = 'split'
"let g:ycm_global_ycm_extra_conf = '/home/greyhound/.vim/plugins/YouCompleteMe/third_party/ycmd/cpp/ycm/.ycm_extra_conf.py'
let g:ycm_filepath_completion_use_working_dir = 0

let NERDTreeShowHidden=1
let NERDTreeShowLineNumbers=0
let NERDTreeAutoDeleteBuffer=1

let g:pymode = 1
let g:pymode_rope_complete_on_dot = 0
let g:pymode_lint = 0
let g:pymode_folding = 0
let g:pymode_rope = 1
let g:pymode_rope_project_root = g:vim_ropepath
let g:pymode_rope_autoimport = 0
let g:pymode_python = 'python3'

let g:hexmode_xxd_options = '-p'

call vundle#begin(g:vim_plugin)
"Plugin 'https://github.com/python-mode/python-mode.git'
Plugin 'https://github.com/majutsushi/tagbar.git'
Plugin 'https://github.com/fidian/hexmode.git'
"Plugin 'https://github.com/lilydjwg/colorizer.git'
"Plugin 'https://github.com/w0rp/ale'
Plugin 'https://github.com/Valloric/YouCompleteMe.git'
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
command! -nargs=? -complete=custom,SessionCompelete OpenSession :call OpenSession("<args>")
command! -nargs=? -complete=custom,SessionCompelete SaveSession :call SaveSession("<args>")
```

## 外部链接
[VIM中文文档](https://github.com/yianwillis/vimcdoc)
