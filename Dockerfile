FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node .npmrc ./

RUN npx prisma generate
RUN npm ci
RUN npm rebuild --arch=arm64 --platform=linuxmusl sharp

COPY --chown=node:node . .

USER node

FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

ENV NODE_ENV=production

RUN npx prisma generate
RUN npm run api:build
RUN npm ci --omit=dev
RUN npm cache clean --force
RUN npm rebuild --arch=arm64 --platform=linuxmusl sharp

USER node

FROM node:18-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

ENV APP_SITE_ORIGIN="http://localhost:4200"
ENV APP_SITE_CORS="http://localhost:4000,http://localhost:3323"

ENV APP_VERSION=1.0
ENV APP_PREFIX="api"
ENV APP_PORT=3323
ENV APP_ENV="local"
ENV APP_ORIGIN="https://instance-1-xn7bqlfyzq-de.a.run.app"
ENV APP_LOG="debug"
ENV APP_MAIL="damage.23x@gmail.com"

# https://docs.nestjs.com/techniques/caching

ENV APP_CACHE_TTL=10
ENV APP_CACHE_MAX=200

# https://docs.nestjs.com/security/rate-limiting

ENV APP_THROTTLER_TTL=60
ENV APP_THROTTLER_LIMIT=120

CMD [ "node", "dist/main.js" ]
