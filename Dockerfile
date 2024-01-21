FROM node:16-alpine as builder
WORKDIR /app
COPY package.json /app/
COPY package-lock.json /app/
RUN npm install
ADD . /app
RUN npm run build

FROM nginx:1.23.1-alpine
COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 8000
CMD ["nginx", "-g", "daemon off;"]
