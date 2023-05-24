FROM node:18.16.0-alpine3.17 as build

WORKDIR /usr/src/app
COPY package.json ./
COPY . .
RUN npm i --frozen-lockfile && npm run build


FROM node:18.16.0-alpine3.17 as development

WORKDIR /usr/src/app
# COPY package.json ormconfig.js ./
COPY package.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
# COPY --from=build /usr/src/app/templates ./templates


FROM node:18.16.0-alpine3.17 as production

WORKDIR /usr/src/app
# COPY package.json ormconfig.js ./
COPY package.json ./
RUN npm i --prod --frozen-lockfile
COPY --from=build /usr/src/app/dist ./dist
# COPY --from=build /usr/src/app/templates ./templates
