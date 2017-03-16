FROM node:latest
COPY . /pdfy
WORKDIR /pdfy 
RUN npm install
EXPOSE 80
CMD ["npm","start"]