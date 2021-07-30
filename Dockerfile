FROM node:14.15-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Installs latest Chromium package.
RUN apk update && apk upgrade && \
  echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
  echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
  apk add --no-cache \
  chromium@edge \
  harfbuzz@edge \
  nss@edge \
  ttf-freefont@edge \
  freetype@edge

# Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
  && mkdir -p /home/pptruser/Downloads \
  && chown -R pptruser:pptruser /home/pptruser \
  && chown -R pptruser:pptruser /usr/src/app

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
  PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Puppeteer v6.0.0 works with Chromium 89.
RUN yarn add puppeteer@6.0.0

# # Run everything after as non-privileged user.
# USER pptruser

# Create app directory
WORKDIR /
COPY ./package.json /usr/src/app

WORKDIR /usr/src/app

# Install
RUN npm install

WORKDIR /
COPY . /usr/src/app
WORKDIR /usr/src/app

# Sharp has to reinstall with linux binaries
RUN npm uninstall sharp
RUN npm install --arch=x64 --platform=linux sharp

# Webpack build
RUN npm run build

# Run everything after as non-privileged user.
USER pptruser

EXPOSE 8081

CMD [ "npm", "start" ]
