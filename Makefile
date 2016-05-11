gulp = node_modules/gulp/bin/gulp.js --harmony

PHONY: test
depend:
	node_modules/check-dependencies/bin/cli.js || npm install
test: depend
	$(gulp) test
clean:
	git clean -x -d -f --exclude=".credentials" --exclude="node_modules"
clean-dry-run:
	git clean -x -d -n --exclude=".credentials" --exclude="node_modules"
clean-cache:
	git clean -x -d -f --exclude=".credentials"
clean-cache-dry-run:
	git clean -x -d -n --exclude=".credentials"
tasks:
	$(gulp) --tasks