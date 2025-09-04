FROM node:22-slim
# FROM node:22
WORKDIR /code
COPY package*.json ./
RUN npm install

# RUN npm init -y
# RUN npm install express
# RUN npm install bunyan
# RUN npm install @splunk/otel

COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]
