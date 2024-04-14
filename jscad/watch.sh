#!/usr/bin/env bash

trap 'echo oh, I ded ; exit' INT

while true; do
  file="$(fswatch -i '*.js' -e '*.stl' -r -1 --event Updated src | xargs -n 1 -I {} echo {})"
  echo "Detected change to file: '$file'"
  ./compile.sh "$file"
done
