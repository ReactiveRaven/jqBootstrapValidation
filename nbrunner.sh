#!/bin/bash

while [ true ];
do
	grunt | head -n 42;
	inotifywait -e modify -r ./ > /dev/null 2>&1;
done;
