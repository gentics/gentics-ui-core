#!/bin/sh
set -o errexit
set -o nounset
WORKDIR="$PWD"

if [ "$release" == true ]
then
	if [ ! -z "$releaseVersion" ]
	then
		cd "/ci/projects/$releaseProjectName/"
		npm version "$releaseVersion"
		cd "$WORKDIR"
	fi

	npm run build -- "$releaseProjectName"
	
	if [ "$releaseNext" == true ]
	then
		npm publish --dry-run --tag next "/ci/dist/$releaseProjectName"
	else
		npm publish --dry-run "/ci/dist/$releaseProjectName"
	fi
fi
