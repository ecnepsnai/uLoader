#!/bin/bash
set -e

rm -f uloader.zip uloader.xpi
zip uloader.zip *.js *.html *.css *.svg *.json 
mv uloader.zip uloader.xpi
