FROM node:12.16.1
WORKDIR /server
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
#RUN npm i -g nodemon 
RUN npm i sqlite3 --build-from-source 
CMD ["npm", "run", "start"]
