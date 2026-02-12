#!/bin/sh

npx typeorm migration:run -d dist/orm.datasource.js

if [ $? -ne 0 ]
then
  # something went wrong; convey that and exit
  exit 1
fi