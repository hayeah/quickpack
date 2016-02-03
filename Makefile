.PHONY: build
build:
	babel src -d lib

.PHONY: watch
watch:
	babel src -d lib -w
