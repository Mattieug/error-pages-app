FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY server.js .
COPY background_guiofamily.png .
COPY background_guiofamily_mobile.png .
EXPOSE 3000
CMD ["node", "server.js"]
