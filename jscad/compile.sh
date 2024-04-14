#!/usr/bin/env bash

file=$1
output_name="$(basename "$(dirname "$file")")"

if [[ -z "$file" || ! -f "$file" ]]; then
  echo "Can't compile file: '$file'"
  echo "Doing nothing.."
  exit 1
fi

dirpath=$(dirname "$file")
stlfile="${dirpath}/${output_name}.stl"

# AppleScript code to close the Preview window
osascript <<EOF
tell application "Preview"
    set allWindows to every window
    repeat with aWindow in allWindows
        if name of aWindow contains "${output_name}.stl" then
            close aWindow
            exit repeat
        end if
    end repeat
end tell
EOF

echo "Compiling file: ${file}"



jscad "$file" -o "$stlfile" && open "$stlfile"
