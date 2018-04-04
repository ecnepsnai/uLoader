#!/bin/sh

cd src
npm install
gulp
cd ../
zip -r uLoader.zip manifest.json uLoader/
