FROM node:latest
COPY . /pdfy
WORKDIR /pdfy 
RUN npm install
EXPOSE 3000
CMD ["npm","start"]