FROM node:18-alpine As preset

WORKDIR /usr/src/database

COPY --chown=node:node . .

RUN npx prisma generate

USER node

FROM node:18-alpine As migrate

WORKDIR /usr/src/database

COPY --chown=node:node --from=preset /usr/src/database/client ./client
COPY --chown=node:node . .

USER node

CMD ["npx", "prisma", "migrate", "deploy"]

FROM node:18-alpine As seed

WORKDIR /usr/src/database

COPY --chown=node:node --from=preset /usr/src/database/client ./client
COPY --chown=node:node . .

RUN npm i bcryptjs @types/bcryptjs
RUN npm i @faker-js/faker

USER node

CMD ["npx", "ts-node", "seed.ts"]
