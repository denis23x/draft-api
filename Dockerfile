# BUILD FOR LOCAL DEVELOPMENT

FROM node:18 As local

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node .npmrc ./

RUN npm i

COPY --chown=node:node . .

RUN npm run prisma:generate

USER node
