FROM node:10-alpine AS builder
LABEL maintainer="p.nyari@gentics.com"
ARG BUILD_USER="jenkins"
# Installs latest Chromium package
RUN echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories \
    && echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories \
    && apk add --no-cache \
    chromium@edge \
    harfbuzz@edge \
    nss@edge \
    freetype@edge \
    ttf-freefont@edge \
    git \
    && rm -rf /var/cache/* \
    && mkdir /var/cache/apk
ENV CHROME_BIN /usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN adduser -D -u 10000 -h /ci ${BUILD_USER}
RUN chown ${BUILD_USER}: /ci -R
USER ${BUILD_USER}
WORKDIR /ci
LABEL stage=builder

# Setup dependencies
FROM builder as dependencies
COPY package.json package-lock.json ./
RUN npm set progress=false \
	&& npm config set depth 0
RUN npm ci
COPY --chown=10000 . .
ARG CACHEBUST=1
RUN echo "Rebuild from here (unique number: $CACHEBUST)"
LABEL stage=buildenv

# Run unit tests
FROM dependencies AS test
ARG linting=false
ARG testing=false
RUN [ "$linting" != true ] || npm run lint
RUN [ "$testing" != true ] || npm run test -- --watch=false --browsers=ChromeHeadlessCI --reporters=junit
LABEL stage=test

# Build application
FROM dependencies AS build
RUN	npm run build -- --progress=false
LABEL stage=build

# Release to NPM
FROM dependencies AS release
ARG releaseProjectName='gentics-ui-core'
ARG release=false
ARG releaseNext=false
ARG releaseVersion=''
RUN sh ci/release.sh
LABEL stage=release

# Publish Docs on Github Pages
FROM dependencies AS docs
ARG GIT_BRANCH=''
ARG publishDocs=false
ARG docsVersion=''
RUN sh ci/publishDocs.sh
LABEL stage=docs