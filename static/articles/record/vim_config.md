{
  "title": "VIM配置文件",
  "profile": "个人VIM配置备份",
  "create_at": "2018-12-31T12:10:01",
  "update_at": "2018-12-31T16:38:01"
}
# VIM配置文件

## code
```vimscript
behave xterm
runtime ftplugin/man.vim

set nocompatible
lang messages en_US.UTF-8

filetype on
filetype plugin on
filetype indent on

set showmatch
set encoding=utf-8
set guifont=Fixedsys\ Excelsior\ 3.01\ 12

set guioptions=a,b,r
set fileformats=unix,dos,mac
set fileencodings=utf-8,ucs-bom,shift-jis,gb18030,gbk,gb2312,cp936
set fileencoding=utf-8
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
set lcs=tab:>-,trail:-
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
set colorcolumn=120
set scrolloff=3
set novisualbell
set t_vb=
set fdm=syntax
set fdl=1
set undofile
set undodir=~/.vim/undodir
set t_Co=256
set columns=150 lines=50

syntax on

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
vnoremap x "_x
vnoremap y "+y

nnoremap <C-h> <C-w>h
nnoremap <C-j> gt
nnoremap <C-k> gT
nnoremap <C-l> <C-w>l
nnoremap <C-s> :w<cr>

map <F3> :tabnew<cr>
map <F4> :close<cr>
map <f5> :PymodeRun<cr>

let NERDTreeShowHidden=1
let NERDTreeShowLineNumbers=0
let NERDTreeAutoDeleteBuffer=1
let NERDTreeCascadeOpenSingleChildDir=0

let g:pymode = 1
let g:pymode_lint = 0
let g:pymode_folding = 0
let g:pymode_rope = 1
let g:pymode_rope_lookup_project = 0
let g:pymode_rope_completion = 0
let g:pymode_python = 'python3'
let g:colorizer_startup = 0

let g:ale_python_pylint_change_directory = 0
let g:ale_c_parse_compile_commands = 1
let g:ale_c_build_dir_names = ['build_linux', 'build_win']

let g:SuperTabDefaultCompletionType = "context"

let g:ycm_global_ycm_extra_conf = '~/.vim/bundle/YouCompleteMe/third_party/ycmd/cpp/ycm/.ycm_extra_conf.py'
let g:ycm_collect_identifiers_from_tags_files = 1
let g:ycm_show_diagnostics_ui = 0
let g:ycm_min_num_of_chars_for_completion = 0
let g:ycm_key_invoke_completion = '<Tab>'

set rtp+=~/.vim/bundle/Vundle.vim/
call vundle#begin()
Plugin 'https://github.com/w0rp/ale'
Plugin 'https://github.com/majutsushi/tagbar.git'
"Plugin 'https://github.com/Valloric/YouCompleteMe.git'
Plugin 'https://github.com/python-mode/python-mode.git'
Plugin 'https://github.com/lilydjwg/colorizer.git'
Plugin 'vim-ext'
call vundle#end()

if has("gui_running")
   colorscheme materialtheme
else
   colorscheme molokai
endif
```
