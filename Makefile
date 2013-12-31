REPORTER = dot

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter $(REPORTER) --ui tdd

test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter $(REPORTER) --growl --ui tdd --watch

test-cov: istanbul

istanbul:
	istanbul cover ./node_modules/mocha/bin/_mocha -- -R spec && cat ./coverage/lcov.info

coveralls:
	cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage

.PHONY: test test-w