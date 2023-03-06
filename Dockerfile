FROM --platform=linux/amd64 node:18-alpine
WORKDIR /opt/app
COPY ./package.json .
RUN yarn install --silent
COPY . .
# RUN node build.js
CMD ["npm", "run", "start"]