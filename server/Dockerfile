FROM node:12.16.1
WORKDIR /server
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
#RUN npm i -g nodemon 
RUN npm i sqlite3 --build-from-source
EXPOSE 3001
CMD ["npm", "run", "start"]

