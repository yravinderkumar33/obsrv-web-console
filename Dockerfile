FROM --platform=linux/amd64 node:18-alpine
WORKDIR /opt/app
COPY ./package*.json .
RUN npm install
COPY . .
CMD ["npm", "run", "server"]