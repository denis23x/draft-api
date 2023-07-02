# BUILD FOR LOCAL DEVELOPMENT

FROM node:18 As local

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm install && npm cache clean --force

COPY --chown=node:node . .

RUN npm run prisma:generate

USER node

# BUILD FOR PRODUCTION

FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=local /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run api:build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node

# PRODUCTION

FROM node:18-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]
