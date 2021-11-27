FROM node:12.16.1
WORKDIR /server
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
#RUN npm i -g nodemon 
RUN npm i sqlite3 --build-from-source 
CMD ["npm", "run", "start"]

# new docker file, not working :c 
# FROM node:12.16.1
# # Set the working directory to /server
# WORKDIR /server
# # copy package.json into the container at /server
# COPY package.json /server/
# COPY package-lock.json /server/
# # install dependencies
# RUN npm i
# #RUN npm i -g nodemon 
# RUN npm i sqlite3 --build-from-source 
# # Copy the current directory contents into the container at /server
# COPY ./ /server/
# # Make port 3001 available to the world outside this container
# EXPOSE 3001
# CMD ["npm", "run", "start"]
