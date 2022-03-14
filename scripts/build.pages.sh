#!/bin/bash
set -e

rm -rf $1

echo "Building Showcase App"
cd showcases-app && yarn && yarn run build && cd ..

RELEASE_OUT="$2/demos/showcases"

mkdir -p $RELEASE_OUT

echo "Copy Demo-Dashboard to $RELEASE_OUT ..."
cp -R showcases-app/build/* $RELEASE_OUT
