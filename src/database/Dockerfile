FROM node:18-alpine As migrate

WORKDIR /usr/src/app

COPY --chown=node:node . .

CMD ["npx", "prisma", "migrate", "deploy"]

USER node

FROM node:18-alpine As seed

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npx prisma generate

RUN npm i bcryptjs
RUN npm i --save-dev @types/bcryptjs
RUN npm i @faker-js/faker
RUN npm i typescript -g
RUN npm link typescript

ENV APP_SITE_ORIGIN="http://localhost:4200"
ENV APP_SITE_CORS="http://localhost:4000,http://localhost:3323"

ENV APP_VERSION=1.0
ENV APP_PREFIX="api"
ENV APP_PORT=3323
ENV APP_ENV="local"
ENV APP_ORIGIN="https://instance-1-xn7bqlfyzq-de.a.run.app"
ENV APP_LOG="debug"
ENV APP_MAIL="damage.23x@gmail.com"

CMD ["npx", "ts-node", "seed.ts"]

USER node
