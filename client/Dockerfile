FROM --platform=linux/amd64 node:18.16.0 as hello-login-app

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "static-server"]
