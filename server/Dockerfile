FROM node:16.13.0
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
#RUN npm i -g nodemon 
RUN npm i --save sqlite3
CMD ["npm", "run", "start"]