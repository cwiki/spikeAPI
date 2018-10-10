FROM node:8
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
# If you are building your code for production
# RUN npm install --only=production
RUN npm install
RUN npm i -g supervisor
# Bundle app source
COPY . . 
EXPOSE 3000
CMD [ "npm", "run", "dev" ]