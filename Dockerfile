FROM node:18 As local

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm install && npm cache clean --force

COPY --chown=node:node . .

RUN npm run prisma:generate

USER node
