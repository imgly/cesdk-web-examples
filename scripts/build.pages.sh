#!/bin/bash
set -e

rm -rf $1

export PUBLIC_URL=/$GIT_BRANCH_NAME/demos/showcases
export REACT_APP_URL_HOSTNAME=https://ubique.img.ly

echo "Building Showcase App for $PUBLIC_URL"
# Retry building maximum 3 times as react-snap / pupeteer is sometimes flaky
cd showcases-app && yarn && ((yarn build && yarn run ssr) || (yarn build && yarn run ssr) || (yarn build && yarn run ssr) || true) && cd ..

RELEASE_OUT="$2/demos/showcases"

mkdir -p $RELEASE_OUT

echo "Copy Showcases Preview to $RELEASE_OUT ..."
cp -R showcases-app/build/* $RELEASE_OUT || true
