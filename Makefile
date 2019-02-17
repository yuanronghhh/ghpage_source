genlist:
	@python3 ./build/py_gen.py

build:
	@npm run build

dev:
	@npm run dev

ghpage: genlist build
	@cp -r ./dist/ghpage/* ./dist/

.PHONY: genlist build dev
