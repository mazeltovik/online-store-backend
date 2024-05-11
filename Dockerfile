FROM node:lts-alpine3.18 AS build

# Create app directory
WORKDIR /usr/src/app


COPY package*.json ./
COPY prisma ./prisma/


RUN npm ci

RUN npm run prisma:generate



COPY . .


RUN npm run build

FROM node:lts-alpine3.18

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist


EXPOSE 3000

CMD [ "node", "dist/main.js" ]