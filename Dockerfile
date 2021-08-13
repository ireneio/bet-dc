FROM node:14.11.0-alpine3.10

COPY ./ ./

RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  freetype-dev \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
  yarn \
  curl \
  xvfb

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
  PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
  TZ='Asia/Taipei'
# Puppeteer v1.19.0 works with Chromium 77.
# RUN yarn add puppeteer@5.2.1

# Add user so we don't need --no-sandbox.
#RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
#    && mkdir -p /home/pptruser/Downloads /app \
#    && chown -R pptruser:pptruser /home/pptruser \
#    && chown -R pptruser:pptruser /app

# RUN cd /crypto-crawler && yarn add puppeteer@5.2.1 && yarn install
RUN npm install --unsafe-perm --ignore-scripts=false
# && yarn add puppeteer@8.0.0

# RUN npm uninstall sharp
# RUN npm install --unsafe-perm --ignore-scripts=false --verbose --arch=x64 --platform=linux sharp

RUN npm run build

EXPOSE 8081

# Run everything after as non-privileged user.
# USER pptruser

# CMD ["xvfb-run", "--auto-servernum", "yarn", "start"]

CMD ["npm", "start"]
