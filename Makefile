build: clean-dj
	npx tsc --project ./packages/djc/tsconfig.json
	cp ./packages/djc/src/emitter/ts/*.dot ./packages/djc/lib/emitter/ts
	@echo "build successfully ❤️"

clean-dj:
	rm -rf ./packages/djc/lib

link: build
	cd ./packages/djc && npm link