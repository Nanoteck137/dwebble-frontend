#!/bin/sh

mkdir -p tmp
curl -L https://raw.githubusercontent.com/Nanoteck137/dwebble/main/api.pyrin -o tmp/api.pyrin
pyrin gen js tmp/api.pyrin -o src/lib/models/apiGen.ts
