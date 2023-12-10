FROM node:alpine

WORKDIR /app    
RUN mkdir public
RUN mkdir public/upload

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8000

CMD ["npm", "start"]