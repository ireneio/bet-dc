FROM node:14.17-alpine3.11

COPY ./ ./

RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  freetype-dev \
  harfbuzz \
  ca-certificates \
  ttf-freefont
  # yarn
  # curl

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
#   PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
#   TZ='Asia/Taipei'

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
  PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Puppeteer v1.19.0 works with Chromium 77.

RUN npm install

RUN npm run build

EXPOSE 8081

CMD ["npm", "start"]
