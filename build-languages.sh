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

echo 'Languages.current = (yt && yt.config_ && yt.config_.HL_LOCALE && Languages[yt.config_.HL_LOCALE]) || Languages[document.documentElement.getAttribute("lang")] || Languages.en;'
