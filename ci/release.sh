#!/bin/sh
set -o errexit
set -o nounset
WORKDIR="$PWD"

releaseProjectName="gentics-ui-core"
releaseNext=${1:-false}
releaseVersion=$2

npm whoami

if [ ! -z "$releaseVersion" ]
then
	cd "projects/$releaseProjectName/"
	npm version "$releaseVersion"
	cd "$WORKDIR"
fi

npm run build -- "$releaseProjectName"

if [ "$releaseNext" == true ]
then
	npm publish --dry-run --tag next "dist/$releaseProjectName"
else
	npm publish --dry-run "dist/$releaseProjectName"
fi
