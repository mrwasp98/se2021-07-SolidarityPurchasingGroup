FROM node:12.16.1
# Set the working directory to /client
WORKDIR /client
# copy package.json into the container at /client
COPY package.json /client/
COPY package-lock.json /client/
# install dependencies
RUN npm i
# Copy the current directory contents into the container at /client
COPY . /client/
# Make port 3000 available to the world outside this container
EXPOSE 3000
# Run the app when the container launches
CMD ["npm", "start"]
