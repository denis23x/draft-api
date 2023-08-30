# BUILD FOR LOCAL DEVELOPMENT

FROM node:18 As local

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node .npmrc ./

RUN npm i

COPY --chown=node:node . .

RUN npx prisma validate
RUN npx prisma generate

# https://sharp.pixelplumbing.com/install#apple-m1

RUN npm rebuild --arch=arm64 --platform=linux  sharp

USER node
