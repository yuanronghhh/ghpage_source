genlist:
	@python3 ./build/py_gen.py

build:
	@npm run build

dev:
	@npm run dev

.PHONY: genlist build dev
