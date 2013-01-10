#!/bin/sh

echo '#import "styles.js"'

echo -n "Styles[\"$(basename $1 .css)\"] = \""

sed 's/\\/\\\\/g;s/"/\\"/g' <$1 | tr -d '\n\t'

echo '";'
