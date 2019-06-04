#!/bin/sh
GIT_BRANCH=$1
# This should be before set -o errexit!
MAINTPREFIX="maintenance-v[0-9][\.x0-9]+"
isMaintenanceBranch=$(echo "$GIT_BRANCH" | grep -Eq "$MAINTPREFIX"; echo $?)

set -o errexit
set -o nounset


PARAMS=""

if [ -z "$docsVersion" ] && [ ! -z "$GIT_BRANCH" ] && [ $isMaintenanceBranch -eq 0 ]
then
	docsVersion=$(echo "$GIT_BRANCH" | cut -d '-' -f 2)
fi

if [ ! -z "$docsVersion" ]
then
	PARAMS="$PARAMS --docsVersion=${docsVersion}"
fi

echo "Will publishes docs part... (PARAMS: $PARAMS)"