#!/bin/sh

echo 'var Languages = {'
find lang -type f -name '*.json' -print | while read filename
do
	language=`basename "$filename" .json`
	echo -ne "\t\"$language\": "
	cat "$filename" | tr -d '\n\t'
	echo ','
done
echo '};'
echo 'function T(item) { return Languages.current[item] || Languages.en[item]; }'

echo 'if (Languages[document.documentElement.getAttribute("lang")])'
echo 'Languages.current = Languages[document.documentElement.getAttribute("lang")];'
echo 'else'
echo 'Languages.current = Languages.en;'
