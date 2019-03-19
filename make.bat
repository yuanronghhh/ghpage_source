@echo off

if "%1" == "dev" (
  @npm run dev
  goto end
)

if "%1" == "genlist" (
  @py -3 ./build/py_gen.py
  goto end
)

if "%1" == "ghpage" (
  @xcopy "dist/ghpage" "dist" /E /Q /Y
  goto end
)

:end
