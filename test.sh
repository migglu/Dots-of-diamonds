#!bin/bash
rm -Rf private_cov
node-jscoverage private private_cov -v --exclude=database --exclude=design --exclude=GameDevelopmentTest.html
expresso -I private_cov test > coverage.txt
cat coverage.txt
