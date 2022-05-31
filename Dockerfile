FROM node:16.15

WORKDIR /app
COPY . .
RUN cp ./config/config.json.deploy ./config/config.json
RUN cp ./config/database.js.deploy ./config/database.js

RUN npm install 
EXPOSE 3000

CMD ["npm","start"]