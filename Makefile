build: clean-dj
	npx tsc --project ./packages/dubbo-dj/tsconfig.json
	cp ./packages/dubbo-dj/src/emitter/ts/*.dot ./packages/dubbo-dj/lib/emitter/ts
	@echo "build successfully ❤️"

clean-dj:
	rm -rf ./packages/dubbo-dj/lib

link: build
	cd ./packages/djc && npm link