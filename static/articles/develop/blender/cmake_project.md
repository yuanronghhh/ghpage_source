{
  "title": "Blender中cmake结构",
  "profile": "blender使用了cmake对python和c和c++进行混合编译, 这里展示一个精简结构",
  "create_at": "2018-12-31T12:10:01",
  "update_at": "2017-12-31T00:00:00"
}
# Blender中cmake的结构

## 前言
Blender编译程序使用了`cmake`进行编译，各个库直接使用`add_subdirectory`包含进来  
并在每个库文件下创建一个`CMakeLists.txt`文件，这样如果不需要哪一个库文件，则直接  
注释掉一行代码即可。

这里显示的是一个精简过的结构。

## 过程

cmake项目首先通过主`CMakeLists.txt`引入`macros.cmake`, 然后创建解决方案`App`, 
对于自己编写的库，都使用`macros.cmake`里面的函数`add_dep_libs`进行包含，
每个外部支持cmake编译的库，直接类似`add_subdirectory(cJSON)`即可引入。
对于不同平台，则放到根据`platform`文件夹, 在主`CMakeLists.txt`里面引入即可。

## 结构

### 目录树
```bash
.
├── build_files
│   └── cmake
│       ├── config
│       ├── macros.cmake
│       └── platform
├── CMakeLists.txt
├── compile_commands.json -> build_linux/compile_commands.json
├── entry
│   ├── CMakeLists.txt
│   ├── config.h
│   ├── entry.c
├── libs
│   ├── cJSON
│   │   ├── cJSON.c
│   │   ├── cJSON.h
│   │   └── CMakeLists.txt
│   ├── CMakeLists.txt
│   ├── logc
│   │   ├── CMakeLists.txt
│   │   └── src
│   └── nginx
├── make.bat
├── Makefile
└── tools
    ├── CMakeLists.txt
    ├── intern
    │   ├── tl_string.c
    │   └── tl_system.c
    ├── tl_string.h
    └── tl_system.h
```

### 主要文件

#### 主CMakeLists文件
```cmake
cmake_minimum_required(VERSION 3.5)

if(NOT EXECUTABLE_OUTPUT_PATH)
	set(FIRST_RUN TRUE)
else()
	set(FIRST_RUN FALSE)
endif()

include(build_files/cmake/macros.cmake)
include(build_files/cmake/config/build_option.cmake)

project(App)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

if(WIN32)
  include(build_files/cmake/platform/platform_win32.cmake)
elseif(UNIX)
  include(build_files/cmake/platform/platform_unix.cmake)
endif()

add_subdirectory(libs)
add_subdirectory(tools)
add_subdirectory(entry)

IF (CMAKE_BUILD_TYPE STREQUAL Debug)
  ADD_DEFINITIONS(-DDEBUG)
ENDIF()
```

#### macros.cmake

```cmake
function(list_assert_duplicates
	list_id
	)
	
	# message(STATUS "list data: ${list_id}")

	list(LENGTH list_id _len_before)
	list(REMOVE_DUPLICATES list_id)
	list(LENGTH list_id _len_after)
	# message(STATUS "list size ${_len_before} -> ${_len_after}")
	if(NOT _len_before EQUAL _len_after)
		message(FATAL_ERROR "duplicate found in list which should not contain duplicates: ${list_id}")
	endif()
	unset(_len_before)
	unset(_len_after)
endfunction()

# Nicer makefiles with -I/1/foo/ instead of -I/1/2/3/../../foo/
# use it instead of include_directories()
function(include_dep_dirs
    includes
    )

  set(_ALL_INCS "")
  foreach(_INC ${ARGV})
    get_filename_component(_ABS_INC ${_INC} ABSOLUTE)
    list(APPEND _ALL_INCS ${_ABS_INC})
    # for checking for invalid includes, disable for regular use
    ##if(NOT EXISTS "${_ABS_INC}/")
    ##	message(FATAL_ERROR "Include not found: ${_ABS_INC}/")
    ##endif()
  endforeach()
  include_directories(${_ALL_INCS})
endfunction()

function(include_dep_dirs_sys
    includes
    )

  set(_ALL_INCS "")
  foreach(_INC ${ARGV})
    get_filename_component(_ABS_INC ${_INC} ABSOLUTE)
    list(APPEND _ALL_INCS ${_ABS_INC})
    ##if(NOT EXISTS "${_ABS_INC}/")
    ##	message(FATAL_ERROR "Include not found: ${_ABS_INC}/")
    ##endif()
  endforeach()
  include_directories(SYSTEM ${_ALL_INCS})
endfunction()

function(code_source_group
    sources
    )

  # Group by location on disk
  source_group("Source Files" FILES CMakeLists.txt)

  foreach(_SRC ${sources})
    get_filename_component(_SRC_EXT ${_SRC} EXT)
    if((${_SRC_EXT} MATCHES ".h") OR
      (${_SRC_EXT} MATCHES ".hpp") OR
      (${_SRC_EXT} MATCHES ".hh"))

      set(GROUP_ID "Header Files")
    else()
      set(GROUP_ID "Source Files")
    endif()
    source_group("${GROUP_ID}" FILES ${_SRC})
  endforeach()
endfunction()

# only MSVC uses SOURCE_GROUP
function(add_dep_libs__impl
    name
    sources
    includes
    includes_sys
    )

  # message(STATUS "Configuring library ${name}")

  # include_directories(${includes})
  # include_directories(SYSTEM ${includes_sys})
  include_dep_dirs("${includes}")
  include_dep_dirs_sys("${includes_sys}")

  add_library(${name} ${sources})

  # works fine without having the includes
  # listed is helpful for IDE's (QtCreator/MSVC)
  code_source_group("${sources}")

  list_assert_duplicates("${sources}")
  list_assert_duplicates("${includes}")
  # Not for system includes because they can resolve to the same path
  # list_assert_duplicates("${includes_sys}")

endfunction()

macro(add_cc_flags_custom_test
	name
	)

	string(TOUPPER ${name} _name_upper)
	if(DEFINED CMAKE_C_FLAGS_${_name_upper})
		message(STATUS "Using custom CFLAGS: CMAKE_C_FLAGS_${_name_upper} in \"${CMAKE_CURRENT_SOURCE_DIR}\"")
		set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} ${CMAKE_C_FLAGS_${_name_upper}}" ${ARGV1})
	endif()
	if(DEFINED CMAKE_CXX_FLAGS_${_name_upper})
		message(STATUS "Using custom CXXFLAGS: CMAKE_CXX_FLAGS_${_name_upper} in \"${CMAKE_CURRENT_SOURCE_DIR}\"")
		set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${CMAKE_CXX_FLAGS_${_name_upper}}" ${ARGV1})
	endif()
	unset(_name_upper)

endmacro()

function(add_dep_libs
	name
	sources
	includes
	includes_sys
	)

	add_cc_flags_custom_test(${name} PARENT_SCOPE)

	add_dep_libs__impl(${name} "${sources}" "${includes}" "${includes_sys}")

	set_property(GLOBAL APPEND PROPERTY BLENDER_LINK_LIBS ${name})
endfunction()

MACRO(WINDOWS_SIGN_TARGET target)
	if(WITH_WINDOWS_CODESIGN)
		if(!SIGNTOOL_EXE)
			error("Codesigning is enabled, but signtool is not found")
		else()
			if(WINDOWS_CODESIGN_PFX_PASSWORD)
				set(CODESIGNPASSWORD /p ${WINDOWS_CODESIGN_PFX_PASSWORD})
			else()
				if($ENV{PFXPASSWORD})
					set(CODESIGNPASSWORD /p $ENV{PFXPASSWORD})
				else()
					message(FATAL_ERROR "WITH_WINDOWS_CODESIGN is on but WINDOWS_CODESIGN_PFX_PASSWORD not set, and environment variable PFXPASSWORD not found, unable to sign code.")
				endif()
			endif()
			add_custom_command(TARGET ${target}
				POST_BUILD
				COMMAND ${SIGNTOOL_EXE} sign /f ${WINDOWS_CODESIGN_PFX} ${CODESIGNPASSWORD} $<TARGET_FILE:${target}>
				VERBATIM
			)
		endif()
	endif()
ENDMACRO()
```

#### build_option.cmake
```cmake
set(WITH_DEBUG             ON  CACHE BOOL "" FORCE)
```
