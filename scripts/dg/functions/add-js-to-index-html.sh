#!/usr/bin/env bash
function add_js_to_index_html() {
  URI=$1
   # Find the line number after the settings.js include in the index.html file.
  INSERT_LINE=$(( `cat index.html | grep -n "settings.js" | awk '{ print $1 }' | tr -d ':'` +1 ))

  # Insert the module's include at that line in the index.html file.
  sed -i "${INSERT_LINE}i \    <script src=\"$URI\"></script>" index.html
  echo "Added to index.html => $URI"
}