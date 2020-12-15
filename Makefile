build: clean-dj
	npx tsc --project ./packages/djc/tsconfig.json
	cp ./packages/djc/src/emitter/ts/*.dot ./packages/djc/lib/emitter/ts
	@echo "build successfully ❤️"

clean-dj:
	rm -rf ./packages/djc/lib

link: build
	cd ./packages/djc && npm link

build-ui: clean-ui
	npx tsc --project ./packages/djc-ui/tsconfig.json
	@echo "build djc-ui successfully ❤️"

clean-ui:
	rm -rf ./packages/djc-ui/lib

link-ui: build-ui
	cd ./packages/djc-ui && npm link