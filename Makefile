.PHONY: watch
watch:
	./node_modules/.bin/tsc --project src --outDir lib -w
