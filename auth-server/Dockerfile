FROM --platform=linux/amd64 node:18.16.0 as oauth-sidecar

WORKDIR server/

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]
