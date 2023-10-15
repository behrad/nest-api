ARG NODE_VERSION=18.16.0
ARG BUILD_ENV=production
ARG DOCKER_REGISTRY
ARG NPM_REGISTRY
ARG BASE_IMG=${NPM_REGISTRY}node:${NODE_VERSION}-alpine

#############################
# BUILD FOR LOCAL DEVELOPMENT
#############################

FROM ${BASE_IMG} AS development

ENV NODE_ENV=$BUILD_ENV

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY --chown=node:node package*.json ./

#RUN if [ -z "$NPM_REGISTRY" ] ; then npm config set registry ${NPM_REGISTRY} ; fi

# clean yarn cache before install
#RUN npm cache clean

# Install app dependencies
RUN npm ci

COPY --chown=node:node . .

USER node

######################
# BUILD FOR PRODUCTION
######################

FROM ${BASE_IMG} AS build

WORKDIR /app

COPY --chown=node:node --from=development /app/package*.json ./
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node --from=development . .

RUN npm run build
ENV NODE_ENV production
RUN npm ci --only=production && npm cache clean --force

USER node

###################
# PRODUCTION DOCKER
###################

FROM ${BASE_IMG} As production

COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist

# CMD npm run start:prod
CMD [ "node", "dist/main.js" ]

EXPOSE 3000